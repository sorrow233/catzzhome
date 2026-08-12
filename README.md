# Catzz Home

Catzz 是一个沉浸式雨夜浏览器起始页。2.7 在保留雨夜视觉的基础上，加入统一搜索与指令、书签分组、今日任务、专注计时、环境音、快速笔记、日历、天气、自定义壁纸和可选的 Firebase 云同步。

## 2.7 Beta 能力

- `Cmd/Ctrl + K` 聚焦搜索，支持网址、计算表达式、`@g`/`@yt`/`@gh` 等定向搜索与 `/focus`、`/note`、`/weather`、`/settings`、`/export` 指令。
- 书签支持分组、拖拽排序、浏览器 HTML 导入；本地数据支持完整 JSON 备份与恢复。
- 今日面板限制最多三个未完成重点任务，专注计时支持 25/50 分钟和程序化雨声、棕色噪声、壁炉声。
- 支持快速笔记、ICS 日历导入、未来七天事件、地理位置天气和按时间自动切换场景。
- 支持 PWA 安装，并在构建时生成可加载到 Chromium 的 `extension-dist/` 新标签页扩展。

## 环境要求

- Node.js 22 或更高版本
- npm 10 或更高版本

## 本地开发

```bash
npm ci
npm run dev
```

访问 `http://localhost:8081`。

## 质量检查

```bash
npm run check
```

该命令依次执行 ESLint、Vitest 和生产构建。生产文件只会生成到 `dist/`，仓库源文件和历史备份不会进入部署目录。

## 部署

正式环境使用 Cloudflare Pages 项目 `catzzhome`，生产分支为 `main`：

```bash
npm run deploy
```

正式域名为 <https://ame.catzz.work>。部署前应确认当前 Git commit 已推送到 `origin/main`，Cloudflare 部署元数据中的 commit SHA 必须与之相同。

Beta 验收环境使用 `beta` 分支：

```bash
npm run deploy:beta
```

## 数据与安全

- 书签、任务、笔记、日历、偏好和语言设置默认存储在浏览器本地。
- 自定义壁纸只保存在当前设备的 IndexedDB，不进入 JSON 备份，也不上传云端；跨设备同步不会覆盖各设备自己的本地壁纸。
- 天气只在用户明确授权定位后请求 Open-Meteo，不保存精确地址。
- 用户主动登录后，设置会同步到 Firebase Firestore。
- Firebase Web 配置是公开客户端标识，数据权限必须由 Firestore Security Rules 按用户 UID 约束。
- 仓库中的 `firestore.rules` 只允许已登录用户读写自己的文档，并校验字段与书签数量。
- 发布目录由 Vite 生成，不允许直接发布仓库根目录。
