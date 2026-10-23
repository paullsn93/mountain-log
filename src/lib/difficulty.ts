export const difficultyLabels: Record<number, string> = {
  1: '步道，半日內，不需經驗',
  2: '一日行程，路況清楚',
  3: '一日長程或有陡升，需基本登山經驗',
  4: '兩天以上、山屋或露營，需完整裝備',
  5: '多日縱走或高風險路段，建議有經驗者帶隊',
};
export const priorityLabels = { high: '很想去', medium: '想去', low: '有空再去' } as const;
export const refTypeLabels = { video: '影片', website: '網站', blog: '文章', map: '地圖', book: '書籍' } as const;
