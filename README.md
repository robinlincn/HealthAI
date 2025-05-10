# AI慢病管理系统 (AI Chronic Disease Management System)

本项目是一个基于Next.js开发的AI慢病管理系统，旨在为患者提供个性化的慢性病管理方案、健康建议和持续支持，同时为医生提供高效的病人管理、病情分析和治疗辅助工具。

## 主要特性

系统包含两大主要部分：**病人端 (手机App风格)** 和 **医生端 (PC管理后台)**。

### 病人端核心功能:

- **AI小助手**:
  - 智能问答：解答健康相关疑问。
  - 健康建议：根据用户数据提供个性化建议。
  - 引导咨询：复杂问题引导用户向医生咨询。
- **健康数据记录**:
  - 血糖、血压、体重、血脂、运动数据的手动输入与蓝牙设备同步。
  - 数据校验与异常提醒。
  - 历史数据图表化展示（日、周、月、年趋势）。
- **病历记录**:
  - 基本信息管理：姓名、性别、年龄、联系方式、紧急联系人等。
  - 病历信息：疾病诊断、既往史、家族史、过敏史等。
  - 检查报告：支持上传（图片/PDF）和查看检查报告。
- **饮食记录**:
  - 食物数据库：搜索、营养信息查询、自定义食物添加。
  - 三餐记录：食物种类、分量、进餐时间。
  - 营养分析：自动计算热量与营养成分，提供分析报告和饮食建议。
- **医患互动**:
  - AI小助手智能问答与建议。
  - 医生咨询：发起文字、图片、视频咨询，预约咨询，查看咨询记录。
- **提醒与通知**:
  - 服药提醒：自定义设置，记录服药情况。
  - 检查提醒：定期检查提醒，记录检查结果。
  - 健康建议推送：个性化及通用健康知识。
- **其他**:
  - 健康课程学习。
  - 病友社区互动。
  - 用户个人中心、设置、帮助与支持。

### 医生端核心功能:

- **病人管理**:
  - 病人信息综合管理（基本信息、病历、健康数据、检查报告）。
  - 添加、编辑、删除病人，支持批量导入导出。
  - 按姓名、病历号、疾病类型、年龄等条件搜索与筛选。
- **病情分析**:
  - 健康数据可视化：病人血糖、血压、体重、血脂等数据的图表化趋势分析。
  - 数据标注：支持在图表上标记重要事件。
  - AI辅助数据分析报告：自动生成含数据统计、趋势分析、异常标记的报告，支持导出。
- **治疗方案与建议**:
  - 个性化治疗方案：药物管理、治疗计划（长期/短期）、调整记录。
  - 治疗建议记录：建议内容、时间、病人执行情况跟踪与反馈。
- **医患沟通**:
  - 病人咨询管理：查看咨询列表、多种方式回复、保存咨询记录。
  - 消息推送：向特定病人或群组推送个性化/批量消息，统计发送与阅读情况。
- **预约管理**:
  - 查看、安排和修改患者的预约日历。
- **数据统计与报告**:
  - 病情趋势分析：分析病人群体健康数据，预测趋势，生成群体报告。
  - 治疗效果评估：对比治疗前后数据，生成评估报告，跟踪效果。
  - 自定义统计报表：按需选择维度、指标、时间范围生成报表并导出。
- **系统管理**:
  - 用户权限管理：角色（医生、护士、管理员）设置与权限分配，账号管理。
  - 数据备份与恢复：自动与手动备份，数据恢复。
  - 系统设置：界面、通知、系统维护。
- **集成与扩展**:
  - 与电子病历系统(EMR)、检查设备(LIS)、第三方健康服务集成（规划中）。
  - API接口管理（规划中）。

## 技术栈

- **前端**: Next.js (App Router), React, TypeScript
- **UI**: Tailwind CSS, ShadCN UI, Lucide React (图标), Recharts (图表)
- **状态管理 & 表单**: React Hook Form, Zod (数据校验)
- **后端 & 数据库**: Firebase (Firestore)
- **AI 功能**: Genkit, Google AI (Gemini)
- **开发工具**: ESLint, Prettier, VSCode

## 项目结构 (概览)

- `src/app/`: Next.js App Router 页面和布局。
  - `(auth)/`: 认证相关页面 (登录、注册)。
  - `dashboard/`: 病人端主要功能页面。
  - `doctor/`: 医生端主要功能页面。
- `src/components/`: 可复用UI组件。
  - `ui/`: ShadCN UI 基础组件。
  - `layout/`: 布局相关组件。
  - `assistant/`, `profile/`, `reports/`等: 特定功能模块组件。
- `src/lib/`: 工具函数、类型定义、配置文件。
  - `firebase.ts`: Firebase 初始化与配置。
  - `nav-links.ts`, `doctor-nav-links.ts`: 导航链接配置。
  - `types.ts`: 全局TypeScript类型定义。
- `src/ai/`: Genkit AI 相关代码。
  - `flows/`: Genkit Flow 定义。
  - `genkit.ts`: Genkit 初始化与配置。
- `src/hooks/`: 自定义React Hooks。
- `public/`: 静态资源。

## 风格指南

- **主色**: 青色 (`#008080`) - 唤起平静和健康的感觉。
- **辅助色**: 浅灰色 (`#F0F0F0`) - 用于干净的背景。
- **强调色**: 天蓝色 (`#87CEEB`) - 用于互动元素。
- 干净和现代的排版，以增强可读性。
- 一致和清晰的图标，便于导航。
- 页面主体内容采用便当盒网格(BentoGrid)布局 (部分页面)。

## 快速开始

### 环境要求

- Node.js (推荐 LTS 版本)
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 配置环境变量

1. 复制 `.env.example` (如果存在) 为 `.env`。
2. 填入必要的环境变量，特别是 Firebase相关的配置。示例:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

   # Genkit/Google AI (if applicable)
   GOOGLE_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_API_KEY
   ```
   **注意**: 将 `YOUR_...` 替换为您的实际 Firebase 和 Google AI 配置值。

### 运行开发服务器

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

应用默认运行在 `http://localhost:9002`。

### 运行 Genkit 开发服务器 (AI功能)

如果需要测试或开发AI相关功能，请在另一个终端运行：
```bash
npm run genkit:dev
# 或使用带热重载的：
npm run genkit:watch
```
Genkit 服务通常运行在 `http://localhost:3100` (Genkit UI 在 `http://localhost:4100`)。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

## 代码质量与检查

- **Linting**: `npm run lint`
- **Type Checking**: `npm run typecheck`

---

欢迎为此项目贡献代码或提出建议！
