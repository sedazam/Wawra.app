import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const audiosTable = pgTable("audios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  coverImageUrl: text("cover_image_url"),
  duration: integer("duration"),
  categoryId: integer("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  publishDate: timestamp("publish_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAudioSchema = createInsertSchema(audiosTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAudio = z.infer<typeof insertAudioSchema>;
export type Audio = typeof audiosTable.$inferSelect;
