import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { gpxStats } from './gpx';

/** 讀取本機私人資料（src/private/trips/<id>.yaml），GitHub 上不存在 */
function readPrivate(id: string): Record<string, unknown> {
  const f = path.join(process.cwd(), 'src/private/trips', `${id}.yaml`);
  return fs.existsSync(f) ? (YAML.parse(fs.readFileSync(f, 'utf8')) ?? {}) : {};
}

let memo: ReturnType<typeof build> | undefined;
export const loadAll = () => (memo ??= build());

async function build() {
  const mountains = (await getCollection('mountains')).sort((a, b) => a.data.name.localeCompare(b.data.name, 'zh-TW'));
  const references = await getCollection('references');
  const lists = await getCollection('lists');
  const rawTrips = await getCollection('trips');

  const slugs = new Set(mountains.map((m) => m.id));
  const refIds = new Set(references.map((r) => r.id));
  const listIds = new Set(lists.map((l) => l.id));
  const errors: string[] = [];

  for (const t of rawTrips) {
    if (!slugs.has(t.data.mountain)) errors.push(`行程「${t.id}」的 mountain「${t.data.mountain}」找不到對應的山檔案`);
    for (const r of t.data.references) if (!refIds.has(r)) errors.push(`行程「${t.id}」引用了不存在的參考資料「${r}」`);
  }
  for (const m of mountains) {
    for (const r of m.data.references) if (!refIds.has(r)) errors.push(`山「${m.id}」引用了不存在的參考資料「${r}」`);
    for (const l of m.data.lists) if (!listIds.has(l.list)) errors.push(`山「${m.id}」的清單「${l.list}」不存在（請在 src/content/lists/ 建立）`);
  }
  if (errors.length) throw new Error('\n資料檢查失敗：\n- ' + errors.join('\n- ') + '\n');

  // visibility: hidden 的行程整筆不顯示、也不納入統計
  const trips = rawTrips
    .filter((t) => t.data.visibility === 'public')
    .map((t) => ({
      ...t,
      data: { ...t.data, ...readPrivate(t.id) } as typeof t.data,
      stats: t.data.gpx ? gpxStats(t.data.gpx) : null,
    }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const climbedSlugs = new Set(trips.map((t) => t.data.mountain));
  const climbed = mountains.filter((m) => climbedSlugs.has(m.id));
  const wishlist = mountains
    .filter((m) => !climbedSlugs.has(m.id))
    .sort((a, b) => ['high', 'medium', 'low'].indexOf(a.data.planning?.priority ?? 'low') - ['high', 'medium', 'low'].indexOf(b.data.planning?.priority ?? 'low'));

  const totals = {
    peaks: climbed.length,
    trips: trips.length,
    distanceKm: trips.reduce((s, t) => s + (t.stats?.distanceKm ?? 0), 0),
    gainM: trips.reduce((s, t) => s + (t.stats?.gainM ?? 0), 0),
  };
  return { mountains, references, lists, trips, climbed, wishlist, climbedSlugs, totals, refMap: new Map(references.map((r) => [r.id, r])) };
}

export const fmtDate = (d: Date) => d.toLocaleDateString('zh-TW', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
export const fmtNum = (n: number, digits = 0) => n.toLocaleString('zh-TW', { maximumFractionDigits: digits, minimumFractionDigits: digits });
