import { Router, type IRouter } from "express";
import { AdminLoginBody, GetAdminSummaryResponse } from "@workspace/api-zod";
import { count, eq, lt, sum } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import { createAdminSession, requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const body = AdminLoginBody.parse(req.body);
  const session = createAdminSession(body.phone, body.pin);
  if (!session) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }
  res.json(session);
});

router.get("/admin/summary", requireAdmin, async (req, res) => {
  try {
    const [[productStats], [lowStockStats], [pendingStats], [orderStats]] =
      await Promise.all([
        db.select({ count: count() }).from(productsTable),
        db.select({ count: count() }).from(productsTable).where(lt(productsTable.stock, 3)),
        db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "pending")),
        db.select({ value: sum(ordersTable.totalPrice) }).from(ordersTable),
      ]);
    const result = GetAdminSummaryResponse.parse({
      productCount: Number(productStats.count),
      lowStockCount: Number(lowStockStats.count),
      pendingOrderCount: Number(pendingStats.count),
      orderValue: Number(orderStats.value ?? 0),
    });
    res.json(result);
  } catch (error) {
    req.log.error({ error }, "Failed to load admin summary");
    res.status(500).json({ error: "Unable to load admin summary" });
  }
});

export default router;