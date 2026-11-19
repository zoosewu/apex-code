# apex-code 專案介紹站

## 決策
- 部署：`zoosewu/apex-code` 的 GitHub Pages → `https://zoosewu.github.io/apex-code/`
- 資料：由 Claude 依指示讀取各專案後寫入 JSON（流程見 CLAUDE.md），不做自動爬取
- API：靜態 JSON；semver，路徑依主版號 `api/v1/`；v1 內只新增；破壞性變更開 v2，舊版同步更新 6 個月後凍結
- 語言：中英雙語
- fork：只標記（`upstream`）；waypoint 視為原創，連結指向 zoosewu
- 排序：陣列順序，使用者指定（目前暫排）
- 頁面：只做卡片列表
- 截圖：方案 B，各專案存 `docs/screenshots/`，同步時複製（docs/SCREENSHOTS.md）
- 渲染方式：先只提供 JSON + 文件，之後看其他專案再決定

## 待辦
- [x] api/v1/projects.json、schema.json、api/index.json
- [x] 介紹頁 index.html（卡片、中英切換、深淺色）
- [x] docs/API.md（含版本規則）、docs/SCREENSHOTS.md
- [x] CLAUDE.md：同步流程 + 專案來源
- [x] tools/check.py 驗證（含反向測試）
- [x] 本機預覽驗證（桌面、英文、360px 無溢出）
- [x] git init + commit
- [ ] 建立 GitHub repo `zoosewu/apex-code`、push、開啟 Pages（使用者）
- [x] docs/INTEGRATION.md：給各專案的單一入口（截圖 + CLAUDE.md 段落 + 回報）
- [ ] 各專案依 INTEGRATION.md 補截圖後同步
- [ ] 使用者指定正式排序
- [ ] 決定給其他專案的渲染方式（元件／純文字）

## Review
- 9 個專案資料完成，驗證通過；只有 zoo-downloader 有截圖（取自 store/screenshots，中英各 3 張）。
- waypoint：zoosewu 上沒有 Release，`version` 為 null、`install` 為空；GitHub 最後 push 是 2026-06-03，本機有之後的 commit 尚未推上去。
- 授權未標示：zoo-downloader（README 徽章寫 MIT 但沒有 LICENSE 檔）、waypoint、zkaraver、ani-gamer-history。
- Chrome 擴充未連線，改用 headless Edge 截圖驗證。
