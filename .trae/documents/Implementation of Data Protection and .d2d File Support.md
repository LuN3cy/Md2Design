# Data Protection & D2D File Format Implementation Plan

## 1. Define .d2d File Format
We will define a JSON-based format (extension `.d2d`) to store user data.
**Structure:**
```typescript
interface D2DData {
  version: string;      // e.g., "1.0.0"
  timestamp: number;    // Export time
  content?: string;     // Markdown content
  style?: CardStyle;    // Style configuration
  theme?: string;       // Theme preference
}
```

## 2. Update TopBar & Export Workflow
**Location:** `src/components/TopBar.tsx`
- **Button Changes**:
  - Rename "Export Image" (导出图片) to "Export" (导出).
  - Add a new "Import" (导入) button next to the Export button.
- **Export Modal Overhaul**:
  - Add a top-level selection: **Export Type** (Image vs. Data).
  - **Image Export**: Keep existing UI (Format, Scale, Mode).
  - **Data Export**:
    - Checkboxes: "Markdown Content" (MD内容), "Style Settings" (样式数据).
    - Action: Download `.d2d` file.
- **Import Functionality**:
  - Add hidden file input accepting `.d2d`.
  - Logic: Parse JSON -> Validate Version -> Update Store (setMarkdown / updateCardStyle).

## 3. Crash Protection (Auto-Download)
**Location:** `src/components/ErrorBoundary.tsx`
- **Enhance `componentDidCatch`**:
  - Detect critical errors.
  - Automatically grab current state from `localStorage` (or memory).
  - Generate a `.d2d` file named `把我导入md2design可以恢复数据.d2d`.
  - Trigger automatic browser download.
- **UI Update**: Update the crash screen text to inform the user that a backup file has been automatically downloaded.

## 4. Internationalization (i18n)
**Location:** `src/i18n.ts`
- Add new keys:
  - `exportData`: "导出数据"
  - `importData`: "导入数据"
  - `dataProtection`: "数据保护"
  - `autoSavedCrash`: "检测到异常，已自动为您保存数据备份"
  - `recoverFromD2D`: "请导入 .d2d 文件恢复数据"

## 5. Implementation Steps
1.  **Modify `TopBar.tsx`**: Implement new Export/Import UI and logic.
2.  **Update `ErrorBoundary.tsx`**: Add auto-download logic.
3.  **Update `i18n.ts`**: Add translations.
4.  **Verify**: Test export/import flow and simulate a crash to test auto-download.
