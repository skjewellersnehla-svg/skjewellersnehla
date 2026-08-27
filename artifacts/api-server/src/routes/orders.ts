import { Router, type IRouter } from "express";
import {
  CreateOrderBody,
  ListOrdersResponse,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
} from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

function serializeOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    createdAt: order.createdAt.toISOString(),
  };
}

router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json(ListOrdersResponse.parse(orders.map(serializeOrder)));
  } catch (error) {
    req.log.error({ error }, "Failed to list orders");
    res.status(500).json({ error: "Unable to load orders" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const order = await db.transaction(async (tx) => {
      const [product] = await tx.select().from(productsTable).where(eq(productsTable.id, body.productId));
      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (product.stock < body.quantity) throw new Error("INSUFFICIENT_STOCK");

      const [created] = await tx.insert(ordersTable).values({
        fullName: body.fullName.trim(),
        phone: body.phone.trim(),
        address: body.address.trim(),
        productId: product.id,
        productName: product.name,
        quantity: body.quantity,
        totalPrice: product.price * body.quantity,
        status: "pending",
      }).returning();

      await tx.update(productsTable)
        .set({ stock: product.stock - body.quantity, updatedAt: new Date() })
        .where(eq(productsTable.id, product.id));
      return created;
    });
    res.status(201).json(serializeOrder(order));
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      res.status(409).json({ error: "This piece is not available in the requested quantity" });
      return;
    }
    req.log.error({ error }, "Failed to create order");
    res.status(400).json({ error: "Unable to create order" });
  }
});

router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateOrderStatusParams.parse(req.params);
    const { status } = UpdateOrderStatusBody.parse(req.body);
    const [order] = await db.update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(serializeOrder(order));
  } catch (error) {
    req.log.error({ error }, "Failed to update order status");
    res.status(400).json({ error: "Unable to update order status" });
  }
});

export default router;