import fs from 'node:fs';
import path from 'node:path';

export interface GpxStats {
  distanceKm: number;
  gainM: number;
  maxEleM: number;
  minEleM: number;
  durationH: number | null;
  points: number;
}

const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;
function haversine(a: [number, number], b: [number, number]) {
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const cache = new Map<string, GpxStats>();

/** 讀取 public/ 下的 GPX，計算里程、累積爬升、最高/最低海拔、總時間 */
export function gpxStats(rel: string): GpxStats {
  if (cache.has(rel)) return cache.get(rel)!;
  const file = path.join(process.cwd(), 'public', rel);
  if (!fs.existsSync(file)) throw new Error(`找不到 GPX 檔：public/${rel}`);
  const xml = fs.readFileSync(file, 'utf8');

  const pts: { ll: [number, number]; ele?: number; t?: number }[] = [];
  for (const m of xml.matchAll(/<trkpt\b([^>]*)>([\s\S]*?)<\/trkpt>/g)) {
    const lat = /lat="([-\d.]+)"/.exec(m[1])?.[1];
    const lon = /lon="([-\d.]+)"/.exec(m[1])?.[1];
    if (!lat || !lon) continue;
    const ele = /<ele>([-\d.]+)<\/ele>/.exec(m[2])?.[1];
    const time = /<time>([^<]+)<\/time>/.exec(m[2])?.[1];
    pts.push({ ll: [+lat, +lon], ele: ele ? +ele : undefined, t: time ? Date.parse(time) : undefined });
  }
  if (pts.length < 2) throw new Error(`GPX 沒有足夠的軌跡點：public/${rel}`);

  let dist = 0;
  for (let i = 1; i < pts.length; i++) dist += haversine(pts[i - 1].ll, pts[i].ll);

  // 爬升：忽略 3 公尺以內的抖動
  const eles = pts.map((p) => p.ele).filter((e): e is number => e !== undefined);
  let gain = 0;
  if (eles.length) {
    let ref = eles[0];
    for (const e of eles) {
      if (e - ref >= 3) { gain += e - ref; ref = e; }
      else if (ref - e >= 3) ref = e;
    }
  }
  const times = pts.map((p) => p.t).filter((t): t is number => t !== undefined && !Number.isNaN(t));
  const stats: GpxStats = {
    distanceKm: dist / 1000,
    gainM: gain,
    maxEleM: eles.length ? Math.max(...eles) : 0,
    minEleM: eles.length ? Math.min(...eles) : 0,
    durationH: times.length > 1 ? (times[times.length - 1] - times[0]) / 3600000 : null,
    points: pts.length,
  };
  cache.set(rel, stats);
  return stats;
}
