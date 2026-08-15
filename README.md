# Catzz Home

Catzz 是一个沉浸式雨夜浏览器起始页。2.7 以壁纸、诗句、搜索和可靠的书签识别为核心，不把新标签页变成重复的效率工具；天气、自定义壁纸与 Firebase 云同步均为可选能力。

## 2.7 Beta 能力

- `Cmd/Ctrl + K` 聚焦搜索，支持网址、计算表达式、`@g`/`@yt`/`@gh` 等定向搜索与 `/weather`、`/settings`、`/export` 指令。
- 中国大陆访客首次使用默认百度，其他地区默认 Google；用户手动选择后不会被地区判断覆盖。
- 添加书签时从网页元数据、Manifest、品牌图标和 favicon 多级识别名称与图标，支持并发校验、缓存、重试和安全回退。
- 书签支持分组、拖拽排序、浏览器 HTML 导入；手机端长按书签后才显示编辑与删除，本地数据支持完整 JSON 备份与恢复。
- 点击首页 Catzz 标题直接打开壁纸画廊，内置壁纸会按设备宽高比保持少女主体居中，并支持自定义本地壁纸和按时间自动切换场景。
- 天气入口默认只显示图标，只有用户点击后才请求定位权限。
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

- 书签、偏好和语言设置默认存储在浏览器本地。
- 自定义壁纸只保存在当前设备的 IndexedDB，不进入 JSON 备份，也不上传云端；跨设备同步不会覆盖各设备自己的本地壁纸。
- 天气只在用户明确授权定位后请求 Open-Meteo，不保存精确地址。
- 用户主动登录后，设置会同步到 Firebase Firestore。
- Firebase Web 配置是公开客户端标识，数据权限必须由 Firestore Security Rules 按用户 UID 约束。
- 仓库中的 `firestore.rules` 只允许已登录用户读写自己的文档，并校验字段与书签数量。
- 发布目录由 Vite 生成，不允许直接发布仓库根目录。
