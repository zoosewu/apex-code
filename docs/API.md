# 專案資料 API

zoosewu 的專案清單，放在 GitHub Pages 上的靜態 JSON。任何網域都可以直接 `fetch`（GitHub Pages 回傳 `Access-Control-Allow-Origin: *`），不需要金鑰。

| 用途 | 網址 |
|---|---|
| 專案清單（v1） | `https://zoosewu.github.io/apex-code/api/v1/projects.json` |
| 格式定義（JSON Schema） | `https://zoosewu.github.io/apex-code/api/v1/schema.json` |
| 版本索引 | `https://zoosewu.github.io/apex-code/api/index.json` |

## 使用端唯一要遵守的規則

> **遇到不認得的欄位或選項值，略過它，不要報錯。**

只要遵守這條，同一個主版號（v1）內的所有更新都不會讓你的程式壞掉。

## 版本規則

API 版本是 semver `主.次.修`，寫在回應的 `apiVersion`。網址只帶主版號（`/api/v1/`）。

| 變更 | 版本 | 網址 |
|---|---|---|
| 修正內容（文字、截圖、版本號），格式不變 | 修訂號 `1.0.X` | 不變 |
| 新增欄位，或在既有選項加新值 | 次版號 `1.X.0` | 不變 |
| 刪除、改名、改型別或改意義 | 主版號 `2.0.0` | 新增 `/api/v2/`，`/api/v1/` 保留 |

舊主版號的保留方式：

1. 新主版號推出後，舊版仍和新版一起更新 **6 個月**，`index.json` 標為 `deprecated` 並寫上 `deprecatedAt`。
2. 6 個月後凍結：資料停在最後一版，網址永遠有效，`index.json` 標為 `frozen` 並寫上 `frozenAt`。

## 資料格式（v1）

```jsonc
{
  "apiVersion": "1.0.0",
  "updatedAt": "2026-11-19",          // 資料最後更新日期
  "locales": ["zh-TW", "en"],
  "projects": [                       // 陣列順序就是建議的顯示順序
    {
      "id": "zing-explore",           // 穩定的識別字（= GitHub repo 名稱）
      "name": "zing-explore",         // 專有名稱，不翻譯
      "tagline":     { "zh-TW": "…", "en": "…" },  // 一句話介紹
      "description": { "zh-TW": "…", "en": "…" },  // 兩三句的介紹
      "status": "active",             // active | maintained | paused | archived
      "upstream": null,               // fork 的來源 repo 網址；原創為 null
      "platforms": ["windows"],       // windows | macos | linux | browser | vscode | docker
      "stack": ["Rust", "Win32"],     // 技術，自由文字
      "version": "v0.6.2",            // 最新 Release tag；沒有 Release 為 null
      "license": "MIT",               // SPDX；未標示為 null
      "links": { "repo": "…", "releases": "…", "homepage": "…" },  // 只有 repo 一定存在
      "install": [                    // 取得方式，第一個是主要方式；可能是空陣列
        { "type": "download", "url": "…", "label": { "zh-TW": "…", "en": "…" } }
      ],                              // type：download | userscript | docker | store
      "screenshots": [                // 第一張是封面；可能是空陣列
        {
          "src": { "zh-TW": "https://…", "en": "https://…" },   // 依語言的圖片，沒有翻譯時兩者相同
          "caption": { "zh-TW": "…", "en": "…" },
          "width": 1280, "height": 800
        }
      ],
      "related": ["kara-creator"],    // 相關專案的 id
      "updatedAt": "2026-11-17"       // 專案最後更新日期
    }
  ]
}
```

所有多語欄位都保證有 `zh-TW` 和 `en`。所有網址都是絕對網址。

## 範例

### 取得所有專案

```js
const res = await fetch('https://zoosewu.github.io/apex-code/api/v1/projects.json');
const { projects } = await res.json();
```

### 取得單一專案

```js
const project = projects.find((p) => p.id === 'zing-explore');
```

### 依語言取字

```js
const lang = navigator.language.startsWith('zh') ? 'zh-TW' : 'en';
const t = (value) => value?.[lang] ?? value?.en ?? '';

t(project.tagline);              // "輕量、快速、可自訂的 Windows 11 檔案總管"
t(project.screenshots[0]?.src);  // 封面圖網址
```

### 顯示「我的其他專案」（排除自己）

```js
const others = projects.filter((p) => p.id !== 'zoo-type');
```

### 最小的卡片渲染

```js
container.innerHTML = '';
for (const p of others) {
  const a = document.createElement('a');
  a.href = p.links.repo;
  a.textContent = `${p.name} — ${t(p.tagline)}`;
  container.append(a);
}
```

完整的渲染方式可以參考本站的 [`assets/app.js`](../assets/app.js)，它本身就是這支 API 的使用端。

## 快取

GitHub Pages 的快取約 10 分鐘。資料更新頻率很低，使用端可以再自行快取（例如一天）。
