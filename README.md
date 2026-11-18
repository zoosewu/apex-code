# apex-code

zoosewu 的專案介紹頁與專案資料 API。

- 介紹頁：<https://zoosewu.github.io/apex-code/>
- API：<https://zoosewu.github.io/apex-code/api/v1/projects.json>（說明見 [docs/API.md](docs/API.md)）
- 截圖指引（給各專案）：[docs/SCREENSHOTS.md](docs/SCREENSHOTS.md)

## 本機預覽

```sh
py -m http.server 8000
py tools/check.py      # 驗證 API 資料
```

## 部署

GitHub repo → Settings → Pages → Source 選 `Deploy from a branch`，分支 `main`、資料夾 `/ (root)`。
