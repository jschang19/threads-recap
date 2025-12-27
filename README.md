# Threadseeker Recap - 2025 Threads 年度回顧

<div align="center">

![Threadseeker Recap Banner](https://recap.threadseeker.app/images/banner.webp)

**「這一年的活網點擊，等你來重溫。」**

[立即開始回顧](https://recap.threadseeker.app) | [Threads 匯出教學](https://reurl.cc/KOqXd9)

</div>

---

## 專案簡介

**Threadseeker Recap** 是一個專為 Threads 使用者打造的年度回顧工具。只需匯出你的 Meta Threads 資料後並上傳，我們就能為你生成一份精美、充滿細節的年度回顧報告，讓你重溫過去一年的社群軌跡。

## 核心特色

- **🎨 沈浸式回顧**：將枯燥的程式碼數據，變成沈浸式的回顧動態，以及簡單清楚的統計圖。
- **📊 深度分析**：
  - **發文習慣**：分析你最常發文的時間點。
  - **最常打的字**：找出你最常用到的關鍵字。
  - **最常提及的帳號**：統計你最常提及的帳號。
- **🔒 隱私安全**：所有資料分析均在您的瀏覽器（Client-side）完成。

## 如何使用？

只需要簡單的四個步驟：

1. **匯出帳號資料**：前往 Meta 帳號中心申請並下載您的 Threads 資料（JSON 格式）。[教學](https://reurl.cc/KOqXd9)
2. **解壓縮**：將下載的 ZIP 檔案解壓縮成資料夾。
3. **上傳資料夾**：點擊「開始回顧」並選擇該解壓縮後的資料夾。
4. **生成回顧**：靜待幾秒，您的年度回顧即刻呈現！

## 100% 隱私優先 (Privacy First)

作者深知隱私對每位使用者的重要性。Threadseeker Recap 的設計核心就是「**絕對的資料隱私**」。

> ### 放心用 Threadseeker Recap 的理由
> - **100% 本地處理**：所有帳號資料的分析均在您的瀏覽器內（Client-side）完成。
> - **無資料上傳**：您的 Threads 原始資料、對話、圖片與分析結果等，**完全不會**離開您的裝置。
> - **無伺服器後端**：本專案沒有後端或資料庫，我們無法，也沒打算儲存您的任何資訊 :D

### 如何自行驗證安全性？
即便您不是工程師，也可以透過以下簡單步驟確認您的資料沒有外流：
1. **開啟開發者工具**：在網頁上按右鍵選擇「檢查」或按下 `F12`。
2. **切換到 Network (網路) 標籤頁**：這會顯示網頁發出的所有請求。
3. **執行分析**：點擊「開始分析」並上傳您的資料。
4. **觀察紀錄**：您會發現除了網頁本身的靜態資源（如圖片、JavaScript）外，**沒有**指向後端 API 的資料傳輸紀錄。

---

# Developer Notes

If you are a developer, The following is some technical details about this project.

## Tech stack

- **framework**： [Nuxt 4](https://nuxt.com/)（Vue 3 Composition API）
- **style**： [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn Nuxt](https://shadcn-nuxt.com/)
- **animation**： [Motion-v](https://motion-v.com/)（Framer Motion for Vue）
- **visualization**： [Chart.js](https://www.chartjs.org/), [D3.js](https://d3js.org/)
- **data analysis**： [Jieba-wasm](https://github.com/yanyiwu/jieba-wasm)（中文字詞分割）、Web Workers
- **deployment**： [Cloudflare Pages](https://pages.cloudflare.com/)


---

## Development and deployment guide

### Environment requirements
- **Node.js**: v22.x 或以上
- **pnpm**: v8.x 或以上

### Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/jschang19/threads-recap.git
   cd threads-recap
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser to see the result.

### Production environment build
Build static site (SSG):
```bash
pnpm generate
```

Build SSR version:
```bash
pnpm build
```

> **Note**: This project is fully CSR to optimize the performance on server side. If you want to build SSR version, you need to change the `ssr` option to `true` in the `nuxt.config.ts` file.

## License

This project is licensed under Apache License 2.0. See the [LICENSE](LICENSE) file for details.