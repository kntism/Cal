# CAL - 现代化计算器应用

一个基于 Next.js 16 构建的现代化计算器应用，支持多行输入计算和实时结果显示。

## 🚀 在线演示

开发服务器运行在 http://localhost:3000

## ✨ 特性

- **多行输入计算器**：支持添加、删除多行算式，每行独立计算
- **智能键盘操作**：使用快捷键快速操作
  - `a` - 在当前行下方添加新行
  - `Delete` - 删除当前行（第一行除外）
  - `Enter` - 计算当前行
- **实时结果显示**：输入即时计算，显示计算结果或错误信息
- **响应式设计**：支持桌面和移动端
- **优雅的界面**：基于 Tailwind CSS v4 和 Shadcn/ui

## 🛠️ 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **UI 库**：React 19.2.0
- **样式**：Tailwind CSS v4
- **组件库**：Shadcn/ui
- **图标**：Lucide React
- **字体**：Geist (Sans & Mono)

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 📁 项目结构

```
cal/
├── app/                      # Next.js App Router
│   ├── basic-math-cal/       # 多行计算器页面
│   │   └── page.tsx         # 多行输入计算器实现
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局（包含导航栏）
│   └── page.tsx             # 首页
├── components/              # 自定义组件
│   ├── NavBar.tsx          # 导航栏组件
│   └── WebsiteTimer.tsx    # 网站运行时间组件
├── lib/                     # 工具函数
│   └── utils.ts            # cn() 函数
├── package.json
└── README.md
```

## 🎯 功能详情

### 基本数学计算器
- 支持基本四则运算：`+` `-` `*` `/`
- 支持括号：`(` `)`
- 支持小数计算
- 正确处理运算符优先级
- 除零错误检测

### 键盘快捷键
- **a 键**：在当前选中行下方添加新行
- **Delete 键**：删除当前行（第一行不可删除）
- **Enter 键**：计算当前行的算式
- **点击**：选中行并获得焦点

## 🎨 界面截图

### 首页
- 显示网站运行时间
- 提供所有功能的入口卡片

### 计算器页面
- 顶部操作说明
- 多行输入框
- 每行独立显示计算结果
- 选中行高亮显示

## 👥 作者

Lu & Sun

## 📄 许可证

MIT