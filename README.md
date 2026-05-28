# BookFlow | 北區贈書單管理系統

BookFlow 是一個專為北區教材發放、贈書管理設計的高質感、單頁式 Web 應用程式 (SPA)。本系統採用了極具未來感的 **Obsidian Dark Mode** 與 **Glassmorphism** (磨砂玻璃) 視覺設計，結合實時統計、智慧選書分流表單以及數據匯出功能，徹底顛覆傳統行政作業的乏味體驗。

---

## 🌟 核心亮點功能

1. **實時指標監控面板 (Dashboard Metrics)**
   *   **總申請件數 / 圖書總數 / 覆蓋學校數 / 急件比例**：每次新增贈書單時，儀表板的四大關鍵指標均會觸發平滑數值更新。
   *   **自適應篩選**：支援跨科目、跨寄送物流的複合性快篩，配合模糊搜尋（教師或學校），讓海量資料秒級定位。

2. **智慧多步驟引導表單 (Smart Wizard Form)**
   *   **科目路徑分流 (Routing)**：選擇科目（例如「英文」）後，表單將會「精準動態加載」該學科關聯的書號清單與專屬增減計數器 (Stepper)，屏蔽與之無關的干擾書籍。
   *   **輸入自動驗證**：對申請本數進行精確的正整數安全防護。
   *   **視覺化請款核對 (Summary)**：在提交的最後一步提供明細確認，降低填報出錯率。

3. **快捷 CSV 匯出功能**
   *   支援一鍵將系統資料庫打包成適合 Microsoft Excel 的 CSV 資料表（含 UTF-8 專屬 BOM 字元防亂碼處理），方便業務代表或出貨倉庫進行下一步操作。

4. **100% 精準復刻歷史手寫單據**
   *   系統已預載並完全轉譯照片中包含的 **7 筆真實申請單資訊**，確保歷史紀錄與後續錄入完美契合。

---

## 📁 專案檔案結構

*   [index.html](file:///Users/rex/.gemini/antigravity/scratch/book_request_app/index.html) - 主畫面框架、動態儀表板與分流引導表單結構。
*   [styles.css](file:///Users/rex/.gemini/antigravity/scratch/book_request_app/styles.css) - 設計系統、微光漸變、磨砂玻璃質感以及多端響應式版面配置。
*   [app.js](file:///Users/rex/.gemini/antigravity/scratch/book_request_app/app.js) - 核心狀態引擎（儀表板計算、動態表單邏輯、資料變更推播以及 CSV 自動生成）。

---

## 🚀 如何啟動

由於此專案為標準的前端 Web 應用，**無需任何複雜的伺服器環境或依賴安裝**。
您只需使用瀏覽器直接開啟 [index.html](file:///Users/rex/.gemini/antigravity/scratch/book_request_app/index.html) 即可開始體驗！

1. 在 Finder 中雙擊 `index.html`，或在終端機中執行：
   ```bash
   open /Users/rex/.gemini/antigravity/scratch/book_request_app/index.html
   ```
2. 盡情享受頂級 UI/UX 帶來的行政管理新視界！
