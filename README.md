# 古德喵特 (Catzz Home)

一个极简、唯美的浏览器起始页，集成了雨夜氛围与云端同步功能。

## ✨ 特性

- **唯美视效**：动态 Canvas 雨滴动画 + 呼吸灯文字效果。
- **自定义壁纸**：内置多款精选日系/暗黑风格壁纸，支持实时切换。
- **云端同步**：集成 **Firebase**，支持 Google 账号登录，跨设备同步壁纸与书签设置。
- **高效导航**：自定义常用网站快捷方式，自动获取图标。
- **响应式设计**：完美适配桌面端与移动端。

## 🚀 快速开始

本项目为纯静态由 HTML/JS 驱动，无需构建。

### 1. 启动服务
使用 Python 内置服务器快速预览：
```bash
python3 -m http.server 8081
```

### 2. 访问
打开浏览器访问：`http://localhost:8081`

## 🛠️ 技术栈
- **核心**:原生 HTML5 / ES6 JavaScript
- **样式**: Tailwind CSS (CDN)
- **后端**: Firebase Authentication & Firestore
