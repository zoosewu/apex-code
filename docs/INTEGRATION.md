# 接入 apex-code（給各專案）

apex-code 是 zoosewu 的作品集與專案資料 API：<https://zoosewu.github.io/apex-code/>。
這份文件寫給**被列入作品集的專案**（以及在那個專案工作的 AI 助手）。照下面的步驟做完即可，**不要修改 apex-code repo**，資料由 apex-code 那邊同步。

## 步驟

### 1. 製作截圖

依 [SCREENSHOTS.md](SCREENSHOTS.md) 在**本專案**建立 `docs/screenshots/`：截圖 1–5 張（16:10）＋ `captions.json`（中英文說明）。

- 用示範資料，畫面不能出現真實的使用者名稱、路徑、Email、Token。
- 專案已有 e2e／Playwright 等測試工具時，優先用它產生截圖，之後介面改了可以重新產生。
- 截不出好看的畫面（例如需要外部服務、帳號）時，不要硬做：在回報中說明缺什麼。

### 2. 在本專案的 CLAUDE.md（或 AGENTS.md）加入這段

```markdown
## 作品集（apex-code）

本專案列在 zoosewu 的作品集：https://zoosewu.github.io/apex-code/
- 截圖：依 https://github.com/zoosewu/apex-code/blob/main/docs/SCREENSHOTS.md 放在 `docs/screenshots/`；
  介面有明顯改變時一併更新截圖與 captions.json
- 要顯示「作者的其他專案」時：依 https://github.com/zoosewu/apex-code/blob/main/docs/API.md 讀取 API，不要把清單寫死在本專案
```

### 3. Commit

照本專案平常的 commit 慣例提交 `docs/screenshots/` 與 CLAUDE.md 的變更。push 依使用者指示。

### 4. 回報

完成後回報以下內容，讓使用者轉告 apex-code 同步：

- 截圖清單（檔名、尺寸、中英說明）
- 沒做到或需要使用者處理的部分

## 不需要做的

- 不用寫專案介紹文字：apex-code 會從 README 整理。若 README 過時或缺英文說明，可以在回報中提出。
- 不用在本專案顯示其他專案清單：只有使用者要求時才依 [API.md](API.md) 實作。
