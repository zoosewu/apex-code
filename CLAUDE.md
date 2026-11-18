# apex-code

zoosewu 的專案介紹站（GitHub Pages：`https://zoosewu.github.io/apex-code/`）與專案資料 API。
純靜態、不需建置：`index.html` + `assets/`，資料在 `api/v1/projects.json`。

## 規則

- **API 相容性**：遵守 [docs/API.md](docs/API.md) 的版本規則。v1 內只能新增欄位或選項值；
  刪除、改名、改型別、改意義一律開 `api/v2/`。每次改 `projects.json` 都要更新 `apiVersion`（修訂號或次版號）和 `updatedAt`，
  改格式時同步更新 `api/v1/schema.json`、`docs/API.md`、`api/index.json`。
- **網址**：API 內一律寫正式站的絕對網址（`https://zoosewu.github.io/apex-code/...`）。
- **語言**：多語欄位必須同時有 `zh-TW` 和 `en`。
- **順序**：`projects` 陣列順序就是顯示順序，由使用者指定，不要自行重排。
- **fork**：`upstream` 填 GitHub 上的 fork 來源；waypoint 由使用者認定為原創，`upstream` 保持 `null`。
- **連結**：一律指向 `zoosewu` 的 repo（包含 waypoint）。

## 同步流程（使用者說「更新 <id>」或「全部更新」）

1. 從下表找到來源。有本機路徑就讀本機，沒有就讀 GitHub（`https://api.github.com/repos/zoosewu/<id>`、README、Releases）。
2. 讀 README（含英文版）、版本設定檔（`Cargo.toml` / `package.json`）、`git log -1`、最新 Release。
3. 更新 `tagline`、`description`（中英）、`platforms`、`stack`、`version`（最新 Release tag，沒有就 `null`）、
   `license`、`install`、`updatedAt`（最後一次 commit 日期）。
4. 截圖：依 [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md) 從 `<專案>/docs/screenshots/` 複製到 `screenshots/<id>/`，
   檔名正規化為 `NN-<說明>.<zh-TW|en>.<ext>`（無語言的圖兩個語言指向同一檔），讀 `captions.json` 寫入 `screenshots`，填實際寬高。
5. 用 `py tools/check.py` 驗證格式，再本機預覽（`py -m http.server`）確認卡片顯示正常。
6. 回報變更內容；commit / push 依使用者指示。

## 專案來源

| id | 本機路徑 | 備註 |
|---|---|---|
| zing-explore | `../folder` | 有英文、日文 README |
| zoo-type | `../zct` | |
| zoo-downloader | `../zoo-downloader` | 截圖目前取自 `store/screenshots/`；README 部分內容過時 |
| waypoint | `../waypoint` | 程式在 `waypoint/` 子資料夾；GitHub 上是 I321I/waypoint 的 fork，但視為原創 |
| z-overlay | `../zOverlay` | |
| kara-creator | `../kara-creator` | 自架，無 Release |
| zkaraver | `../karaver` | 自架，Docker 映像在 ghcr.io，無 Release |
| vscode-project-manager | （僅 GitHub） | fork 自 alefragnani/vscode-project-manager，預設分支 master |
| ani-gamer-history | （僅 GitHub） | Tampermonkey 腳本，tag 沒有 `v` 前綴，預設分支 master |
