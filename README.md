# 登山紀錄

記錄爬過的山、整理想爬的山。網站：https://paullsn93.github.io/mountain-log/

## 第一次上傳到 GitHub

在專案資料夾打開終端機：

```bash
git init
git add .
git commit -m "初始化登山紀錄網站"
git branch -M main
git remote add origin https://github.com/paullsn93/mountain-log.git
git push -u origin main
```

然後到 GitHub 的 repo：**Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
等 Actions 跑完（約 1～2 分鐘），網站就上線。

## 本機預覽

```bash
npm install      # 只需第一次
npm run dev      # 開啟 http://localhost:4321/mountain-log/
npm run check    # 檢查所有資料欄位是否正確
```

## 日常使用

| 想做的事 | 做法 |
|---|---|
| 新增一座山 / 想爬的山 | 在 `src/content/mountains/` 新增 `英文檔名.md`（複製範例改） |
| 記錄一次行程 | 在 `src/content/trips/` 新增 `日期-山名.md`，`mountain:` 填山的檔名 |
| 加參考資料 | 在 `src/content/references.yaml` 加一筆，山或行程用 `id` 引用 |
| 放 GPX | 行程放 `public/gpx/trips/`，參考軌跡放 `public/gpx/ref/` |
| 發佈 | `git add .` → `git commit -m "說明"` → `git push` |

**「已爬」與「想爬」是自動判斷的**：某座山只要有行程紀錄就算已爬，沒有就出現在想爬清單。

欄位寫錯（例如難度 9、山名拼錯、引用不存在的參考資料）時，`npm run dev` 或 `npm run check` 會直接告訴你哪個檔案哪個欄位有問題；
push 後若資料有誤，GitHub Actions 會失敗而不會更新網站。

## 難度定義

| 級別 | 說明 |
|---|---|
| 1 | 步道，半日內，不需經驗 |
| 2 | 一日行程，路況清楚 |
| 3 | 一日長程或有陡升，需基本登山經驗 |
| 4 | 兩天以上、山屋或露營，需完整裝備 |
| 5 | 多日縱走或高風險路段，建議有經驗者帶隊 |

## 隱私

- 住宿、伙伴本名等不想公開的資料，放在 `src/private/trips/<行程檔名>.yaml`，已被 `.gitignore` 排除，不會上傳；本機預覽會顯示，公開網站不會。詳見 `src/private/README.md`。
- 行程設 `visibility: hidden` 則整筆不顯示、也不納入統計。**注意**：檔案仍在公開 repo 內，真正敏感的內容請用上面的私人檔案。
- 照片放 Google 相簿、影片放 YouTube，這裡只放連結。

## 範例資料

目前的三座山與一筆行程都是**範例**（名稱含「範例」，座標為概略值，連結為占位）。確認網站運作後請刪除或改寫。
