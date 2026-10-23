/** 產生含 base 的網址，例如 url('trips/') → /mountain-log/trips/ */
export const url = (p = '') => import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + p.replace(/^\//, '');
