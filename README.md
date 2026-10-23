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

## 日常使用：用網頁編輯（Pages CMS）

不用開 VS Code，也不用打指令：

1. 打開 https://app.pagescms.org ，按 **Sign in with GitHub**。
2. 第一次要按 **Install the GitHub App**，授權給 `paullsn93/mountain-log`（只選這一個 repo 即可）。
3. 進入 `mountain-log`，左邊選單有三個項目：
   - **山岳資料（含想爬的山）**：新增山、填難度、行前規劃、參考 GPX、參考資料。
   - **行程紀錄（已爬）**：選山、日期、心情、上傳 GPX、相簿、影片、住宿、景點、遊記。
   - **參考資料**：影片、網站、文章，數量不限；山和行程用下拉選單挑選。
4. 填完按 **Save**。約 1～2 分鐘後網站自動更新（可到 repo 的 Actions 分頁看進度）。

**順序**：先建「參考資料」→ 再建「山」→ 最後記「行程」，這樣下拉選單才選得到。

「已爬」與「想爬」是自動判斷的：某座山只要有行程紀錄就算已爬，沒有就出現在想爬清單。

如果資料有誤（例如難度超出範圍），GitHub Actions 會顯示紅色叉叉，**網站維持上一個正常版本、不會壞掉**，修正後再存一次即可。

### 進階：用電腦編輯
也可以直接改 `src/content/` 內的檔案，`npm run check` 檢查，再 `git push`。
**注意**：用網頁編輯後，電腦上的專案會落後，改檔案前請先執行 `git pull`。

## 難度定義

| 級別 | 說明 |
|---|---|
| 1 | 步道，半日內，不需經驗 |
| 2 | 一日行程，路況清楚 |
| 3 | 一日長程或有陡升，需基本登山經驗 |
| 4 | 兩天以上、山屋或露營，需完整裝備 |
| 5 | 多日縱走或高風險路段，建議有經驗者帶隊 |

## 隱私

- **用網頁編輯時，填進去的所有內容都會存進公開 repo，任何人都看得到**。伙伴請用暱稱，住宿等敏感資料請不要填。
- 若真的要保留私人資料，只能在電腦上放 `src/private/trips/<行程檔名>.yaml`（已被 `.gitignore` 排除，不會上傳；僅本機預覽顯示）。詳見 `src/private/README.md`。
- 行程設 `visibility: hidden` 則整筆不顯示、也不納入統計。**注意**：檔案仍在公開 repo 內，真正敏感的內容請用上面的私人檔案。
- 照片放 Google 相簿、影片放 YouTube，這裡只放連結。

## 範例資料

目前的三座山與一筆行程都是**範例**（名稱含「範例」，座標為概略值，連結為占位）。確認網站運作後請刪除或改寫。
