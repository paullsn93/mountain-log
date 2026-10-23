import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const lonLat = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]); // [緯度, 經度]

// ── 山 / 路線 ─────────────────────────────────────────
const mountains = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mountains' }),
  schema: z.object({
    name: z.string(),
    elevation: z.number().int().positive(),
    region: z.string(),
    coordinates: lonLat,
    difficulty: z.number().int().min(1).max(5),
    lists: z.array(z.object({ list: z.string(), no: z.number().int().optional() })).default([]),
    planning: z
      .object({
        priority: z.enum(['high', 'medium', 'low']).default('medium'),
        best_season: z.string().optional(),
        days: z.number().positive().optional(),
        permits: z.string().optional(),
        risks: z.string().optional(),
      })
      .optional(),
    gpx: z.string().optional(),            // 參考軌跡，相對於 public/
    references: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

// ── 行程紀錄 ─────────────────────────────────────────
const trips = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/trips' }),
  schema: z.object({
    mountain: z.string(),                  // 對應 mountains 的檔名（不含 .md）
    date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    companions: z.array(z.string()).default([]),
    mood: z.string().optional(),
    mood_note: z.string().optional(),
    gpx: z.string().optional(),            // 實際軌跡，相對於 public/
    album: z.string().url().optional(),    // Google 相簿連結
    cover: z.string().optional(),          // 相對於 public/，例如 covers/xxx.jpg
    videos: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    lodging: z
      .array(z.object({ name: z.string(), url: z.string().url().optional(), cost: z.number().optional(), note: z.string().optional() }))
      .default([]),
    transport: z.string().optional(),
    weather: z.object({ summary: z.string().optional(), temp: z.number().optional(), wind: z.string().optional() }).optional(),
    plan: z.object({ est_hours: z.number().optional(), itinerary: z.string().optional() }).optional(),
    actual: z.object({ hours: z.number().optional() }).optional(),
    poi: z.array(z.object({ name: z.string(), coordinates: lonLat.optional(), note: z.string().optional() })).default([]),
    rating: z
      .object({ felt_difficulty: z.number().int().min(1).max(5).optional(), recommend: z.number().int().min(1).max(5).optional() })
      .optional(),
    references: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    visibility: z.enum(['public', 'hidden']).default('public'),
  }),
});

// ── 參考資料（影片／網站／文章…，數量不限）──────────────
const references = defineCollection({
  loader: file('src/content/references.yaml'),
  schema: z.object({
    type: z.enum(['video', 'website', 'blog', 'map', 'book']),
    title: z.string(),
    url: z.string().url(),
    note: z.string().optional(),
  }),
});

// ── 清單（百岳、小百岳…）──────────────────────────────
const lists = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/lists' }),
  schema: z.object({
    name: z.string(),
    total: z.number().int().positive().optional(),
    source: z.object({ title: z.string(), url: z.string().url(), retrieved: z.coerce.date() }).optional(),
    items: z.array(z.object({ no: z.number().int(), name: z.string(), elevation: z.number().optional(), mountain: z.string().optional() })).default([]),
  }),
});

export const collections = { mountains, trips, references, lists };
