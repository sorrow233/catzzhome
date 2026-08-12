# Catzz Home

Catzz 是一个沉浸式雨夜浏览器起始页，提供自定义壁纸、快捷入口、多语言界面和可选的 Firebase 云同步。

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

## 数据与安全

- 书签、壁纸和语言设置默认存储在浏览器本地。
- 用户主动登录后，设置会同步到 Firebase Firestore。
- Firebase Web 配置是公开客户端标识，数据权限必须由 Firestore Security Rules 按用户 UID 约束。
- 仓库中的 `firestore.rules` 只允许已登录用户读写自己的文档，并校验字段与书签数量。
- 发布目录由 Vite 生成，不允许直接发布仓库根目录。
