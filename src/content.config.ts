import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── 容錯小工具：網頁編輯器可能存出空字串或 null，一律視為「沒填」 ──
const opt = <T extends z.ZodTypeAny>(s: T) => z.preprocess((v) => (v === '' || v === null ? undefined : v), s.optional());
const arr = <T extends z.ZodTypeAny>(s: T) => z.preprocess((v) => v ?? [], z.array(s));
// 引用其他檔案時，網頁編輯器存的是路徑（src/content/mountains/xxx.md），這裡統一轉成檔名 id
const ref = z.string().transform((v) => v.replace(/^.*[\\/]/, '').replace(/\.(md|yaml|yml)$/, ''));
const coord = opt(z.object({ lat: opt(z.number().min(-90).max(90)), lng: opt(z.number().min(-180).max(180)) }));

// 檔名（不含副檔名）直接當 id，不做任何轉換
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.[^.]+$/, '');

// ── 山 / 路線 ─────────────────────────────────────────
const mountains = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mountains', generateId }),
  schema: z.object({
    name: z.string(),
    elevation: z.number().int().positive(),
    region: z.string(),
    coordinates: coord,
    difficulty: z.number().int().min(1).max(5),
    lists: arr(z.object({ list: z.string(), no: opt(z.number().int()) })),
    planning: opt(
      z.object({
        priority: z.preprocess((v) => v || undefined, z.enum(['high', 'medium', 'low']).default('medium')),
        best_season: opt(z.string()),
        days: opt(z.number().positive()),
        permits: opt(z.string()),
        risks: opt(z.string()),
      }),
    ),
    gpx: opt(z.string()),
    references: arr(ref),
    tags: arr(z.string()),
  }),
});

// ── 行程紀錄 ─────────────────────────────────────────
const trips = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/trips', generateId }),
  schema: z.object({
    mountain: ref,
    date: z.coerce.date(),
    end_date: opt(z.coerce.date()),
    companions: arr(z.string()),
    mood: opt(z.string()),
    mood_note: opt(z.string()),
    gpx: opt(z.string()),
    album: opt(z.string().url()),
    cover: opt(z.string()),
    videos: arr(z.object({ title: z.string(), url: z.string().url() })),
    lodging: arr(z.object({ name: z.string(), url: opt(z.string().url()), cost: opt(z.number()), note: opt(z.string()) })),
    transport: opt(z.string()),
    weather: opt(z.object({ summary: opt(z.string()), temp: opt(z.number()), wind: opt(z.string()) })),
    plan: opt(z.object({ est_hours: opt(z.number()), itinerary: opt(z.string()) })),
    actual: opt(z.object({ hours: opt(z.number()) })),
    poi: arr(z.object({ name: z.string(), coordinates: coord, note: opt(z.string()) })),
    rating: opt(z.object({ felt_difficulty: opt(z.number().int().min(1).max(5)), recommend: opt(z.number().int().min(1).max(5)) })),
    references: arr(ref),
    tags: arr(z.string()),
    visibility: z.preprocess((v) => v || undefined, z.enum(['public', 'hidden']).default('public')),
  }),
});

// ── 參考資料（影片／網站／文章…，一筆一個檔，數量不限）──
const references = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/references', generateId }),
  schema: z.object({
    type: z.enum(['video', 'website', 'blog', 'map', 'book']),
    title: z.string(),
    url: z.string().url(),
    note: opt(z.string()),
  }),
});

// ── 清單（百岳、小百岳…）──────────────────────────────
const lists = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/lists', generateId }),
  schema: z.object({
    name: z.string(),
    total: opt(z.number().int().positive()),
    source: opt(z.object({ title: z.string(), url: z.string().url(), retrieved: z.coerce.date() })),
    items: arr(z.object({ no: z.number().int(), name: z.string(), elevation: opt(z.number()), mountain: opt(z.string()) })),
  }),
});

export const collections = { mountains, trips, references, lists };
