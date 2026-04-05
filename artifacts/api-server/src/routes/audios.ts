import { Router, type IRouter } from "express";
import { eq, ilike, and, desc, sql, or } from "drizzle-orm";
import { db, audiosTable, categoriesTable } from "@workspace/db";
import {
  ListAudiosQueryParams,
  GetFeaturedAudiosQueryParams,
  GetLatestAudiosQueryParams,
  CreateAudioBody,
  UpdateAudioBody,
  GetAudioParams,
  UpdateAudioParams,
  DeleteAudioParams,
  GetAudioBySlugParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const audioWithCategory = {
  id: audiosTable.id,
  title: audiosTable.title,
  slug: audiosTable.slug,
  description: audiosTable.description,
  audioUrl: audiosTable.audioUrl,
  coverImageUrl: audiosTable.coverImageUrl,
  duration: audiosTable.duration,
  categoryId: audiosTable.categoryId,
  categoryName: categoriesTable.name,
  categorySlug: categoriesTable.slug,
  categoryColor: categoriesTable.color,
  published: audiosTable.published,
  featured: audiosTable.featured,
  publishDate: audiosTable.publishDate,
  createdAt: audiosTable.createdAt,
  updatedAt: audiosTable.updatedAt,
};

router.get("/audios", async (req, res): Promise<void> => {
  const params = ListAudiosQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { search, categoryId, published, limit = 20, offset = 0 } = params.data;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(audiosTable.title, `%${search}%`),
        ilike(audiosTable.description, `%${search}%`),
      )
    );
  }
  if (categoryId != null) {
    conditions.push(eq(audiosTable.categoryId, categoryId));
  }
  if (published != null) {
    conditions.push(eq(audiosTable.published, published));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countRows] = await Promise.all([
    db
      .select(audioWithCategory)
      .from(audiosTable)
      .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
      .where(whereClause)
      .orderBy(desc(audiosTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(audiosTable)
      .where(whereClause),
  ]);

  res.json({
    items,
    total: countRows[0]?.count ?? 0,
    limit,
    offset,
  });
});

router.get("/audios/featured", async (req, res): Promise<void> => {
  const params = GetFeaturedAudiosQueryParams.safeParse(req.query);
  const limit = params.success && params.data.limit ? params.data.limit : 6;

  const items = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(and(eq(audiosTable.featured, true), eq(audiosTable.published, true)))
    .orderBy(desc(audiosTable.publishDate))
    .limit(limit);

  res.json(items);
});

router.get("/audios/latest", async (req, res): Promise<void> => {
  const params = GetLatestAudiosQueryParams.safeParse(req.query);
  const limit = params.success && params.data.limit ? params.data.limit : 8;

  const items = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(eq(audiosTable.published, true))
    .orderBy(desc(audiosTable.publishDate))
    .limit(limit);

  res.json(items);
});

router.get("/audios/stats", async (_req, res): Promise<void> => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [statsRows] = await db
    .select({
      totalAudios: sql<number>`count(*)::int`,
      publishedAudios: sql<number>`sum(case when ${audiosTable.published} = true then 1 else 0 end)::int`,
      featuredAudios: sql<number>`sum(case when ${audiosTable.featured} = true then 1 else 0 end)::int`,
      recentUploads: sql<number>`sum(case when ${audiosTable.createdAt} >= ${sevenDaysAgo.toISOString()} then 1 else 0 end)::int`,
    })
    .from(audiosTable);

  const [catRow] = await db
    .select({ totalCategories: sql<number>`count(*)::int` })
    .from(categoriesTable);

  res.json({
    totalAudios: statsRows?.totalAudios ?? 0,
    publishedAudios: statsRows?.publishedAudios ?? 0,
    totalCategories: catRow?.totalCategories ?? 0,
    featuredAudios: statsRows?.featuredAudios ?? 0,
    recentUploads: statsRows?.recentUploads ?? 0,
  });
});

router.post("/audios", async (req, res): Promise<void> => {
  const parsed = CreateAudioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = {
    ...parsed.data,
    publishDate: parsed.data.publishDate ? new Date(parsed.data.publishDate) : null,
  };

  const [audio] = await db.insert(audiosTable).values(data).returning();

  const [result] = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(eq(audiosTable.id, audio.id));

  res.status(201).json(result);
});

router.get("/audios/slug/:slug", async (req, res): Promise<void> => {
  const params = GetAudioBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [audio] = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(eq(audiosTable.slug, params.data.slug));

  if (!audio) {
    res.status(404).json({ error: "Audio not found" });
    return;
  }

  res.json(audio);
});

router.get("/audios/:id", async (req, res): Promise<void> => {
  const params = GetAudioParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [audio] = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(eq(audiosTable.id, params.data.id));

  if (!audio) {
    res.status(404).json({ error: "Audio not found" });
    return;
  }

  res.json(audio);
});

router.patch("/audios/:id", async (req, res): Promise<void> => {
  const params = UpdateAudioParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAudioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.publishDate !== undefined) {
    data.publishDate = parsed.data.publishDate
      ? new Date(parsed.data.publishDate)
      : null;
  }

  const [updated] = await db
    .update(audiosTable)
    .set(data)
    .where(eq(audiosTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Audio not found" });
    return;
  }

  const [result] = await db
    .select(audioWithCategory)
    .from(audiosTable)
    .leftJoin(categoriesTable, eq(categoriesTable.id, audiosTable.categoryId))
    .where(eq(audiosTable.id, updated.id));

  res.json(result);
});

router.delete("/audios/:id", async (req, res): Promise<void> => {
  const params = DeleteAudioParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(audiosTable)
    .where(eq(audiosTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Audio not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
