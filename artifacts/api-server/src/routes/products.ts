import { Router, type IRouter } from "express";
import {
  CreateProductBody,
  GetProductParams,
  ListProductsResponse,
  UpdateProductBody,
  UpdateProductParams,
} from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

function serializeProduct(product: typeof productsTable.$inferSelect) {
  return {
    ...product,
    weight: Number(product.weight),
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
    res.json(ListProductsResponse.parse(products.map(serializeProduct)));
  } catch (error) {
    req.log.error({ error }, "Failed to list products");
    res.status(500).json({ error: "Unable to load products" });
  }
});

router.get("/products/:id", async (req, res) => {
  const { id } = GetProductParams.parse(req.params);
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(serializeProduct(product));
});

router.post("/products", requireAdmin, async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db.insert(productsTable).values(body).returning();
    res.status(201).json(serializeProduct(product));
  } catch (error) {
    req.log.error({ error }, "Failed to create product");
    res.status(400).json({ error: "Unable to create product" });
  }
});

router.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse(req.params);
    const body = UpdateProductBody.parse(req.body);
    const [product] = await db.update(productsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(serializeProduct(product));
  } catch (error) {
    req.log.error({ error }, "Failed to update product");
    res.status(400).json({ error: "Unable to update product" });
  }
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse(req.params);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (error) {
    req.log.error({ error }, "Failed to delete product");
    res.status(400).json({ error: "Unable to delete product" });
  }
});

export default router;