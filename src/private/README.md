# 私人資料（不會上傳到 GitHub）

放在 `src/private/trips/<行程檔名>.yaml`，內容會在本機預覽時合併進行程頁；
GitHub 自動部署時看不到這些檔案，所以公開網站不會出現。

例如 `src/private/trips/2026-03-14-qixingshan.yaml`：

```yaml
companions: [王小山]
lodging:
  - { name: 某某民宿, cost: 2400, note: 老闆很親切 }
```
