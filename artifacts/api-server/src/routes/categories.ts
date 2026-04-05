import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, audiosTable } from "@workspace/db";
import {
  CreateCategoryBody,
  UpdateCategoryBody,
  GetCategoryParams,
  UpdateCategoryParams,
  DeleteCategoryParams,
  GetCategoryBySlugParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getCategoryWithCount(id: number) {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      color: categoriesTable.color,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
      audioCount: sql<number>`count(${audiosTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(audiosTable, eq(audiosTable.categoryId, categoriesTable.id))
    .where(eq(categoriesTable.id, id))
    .groupBy(categoriesTable.id);
  return rows[0] ?? null;
}

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      color: categoriesTable.color,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
      audioCount: sql<number>`count(${audiosTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(audiosTable, eq(audiosTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.name);
  res.json(rows);
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, parsed.data.slug));

  if (existing.length > 0) {
    res.status(409).json({ error: "A category with this slug already exists" });
    return;
  }

  const [cat] = await db
    .insert(categoriesTable)
    .values(parsed.data)
    .returning();

  const result = await getCategoryWithCount(cat.id);
  res.status(201).json(result);
});

router.get("/categories/slug/:slug", async (req, res): Promise<void> => {
  const params = GetCategoryBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      color: categoriesTable.color,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
      audioCount: sql<number>`count(${audiosTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(audiosTable, eq(audiosTable.categoryId, categoriesTable.id))
    .where(eq(categoriesTable.slug, params.data.slug))
    .groupBy(categoriesTable.id);

  if (rows.length === 0) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(rows[0]);
});

router.get("/categories/:id", async (req, res): Promise<void> => {
  const params = GetCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const result = await getCategoryWithCount(params.data.id);
  if (!result) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(result);
});

router.patch("/categories/:id", async (req, res): Promise<void> => {
  const params = UpdateCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(categoriesTable)
    .set(parsed.data)
    .where(eq(categoriesTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  const result = await getCategoryWithCount(updated.id);
  res.json(result);
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const params = DeleteCategoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
