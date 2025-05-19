
# AI慢病管理系统 (AI Chronic Disease Management System)

本项目是一个基于Next.js开发的AI慢病管理系统，旨在为患者提供个性化的慢性病管理方案、健康建议和持续支持，同时为医生提供高效的病人管理、病情分析和治疗辅助工具，并辅以一个SAAS管理后台对整个平台进行管理。

## 主要特性

系统包含三大主要部分：**病人端 (手机App风格)**, **医生端 (PC管理后台)**, 和 **SAAS管理后台**。

### 病人端核心功能 (Next.js Version):

- **AI小助手**: 智能问答、健康建议、引导咨询，支持图片、文档、音视频附件（目前AI仅能识别附件元数据）。
- **健康数据记录**: 血糖、血压、体重、血脂、运动数据的手动输入与图表化历史趋势展示。支持监测数据对比功能。
- **病历记录**:
  - 基本信息管理：姓名、性别、生日、联系方式、紧急联系人等（支持AI从文档识别填充）。
  - 详细健康档案：家族病史、现有症状、过敏史、手术史、输血史、用药史（类别）、接触史、饮食习惯、膳食摄入、运动锻炼、吸烟情况、饮酒情况、心理健康（含SAS问卷）、遵医行为、睡眠状况、其他补充信息（如当前用药、联系偏好、建议、服务满意度）的记录与编辑。
  - 检查报告：支持上传（图片/PDF）和查看检查报告。
- **饮食记录**: 简单的食物数据库搜索（模拟）、三餐记录（模拟）和营养分析（占位）。
- **用药计划**: 查看用药计划、用药调整历史、用药记录（均为模拟数据展示）。
- **医患互动**:
  - AI小助手智能问答。
  - 医生咨询：发起文字咨询，可附带附件；查看咨询记录（与医生端联动）。
- **提醒与通知**: 服药提醒、检查提醒、健康建议推送（模拟）。
- **其他**: 健康课程学习（占位）、病友社区（占位）、用户个人中心、设置、帮助与支持。

### 病人端核心功能 (Vue.js Version - In Development):
一个使用 Vue.js 3, Vite, Pinia, 和 Tailwind CSS 构建的病人端应用正在开发中。它旨在复制 Next.js 版本的功能和风格。
- 目录: `vue-patient-app/`
- 主要技术: Vue 3, Vite, Vue Router, Pinia, Tailwind CSS, Lucide-vue-next
- 当前状态: 基础结构和部分占位页面已搭建。通过 `/vue-patient-app/` 访问。

### 医生端核心功能 (Next.js Version - PC管理后台风格):

- **病人管理**:
  - 病人信息综合管理：查看病人列表（支持搜索和筛选）、病人详细档案（基本信息、完整病历、健康数据摘要、检查报告列表）。
  - AI智能填充新病人档案：支持上传文档（图片/PDF），通过AI识别并预填充新病人表单。
  - 添加、编辑病人档案（包含全面的健康问卷字段）。
- **病情分析**:
  - 健康数据可视化：查看病人血糖、血压等趋势图（模拟数据）。
  - AI辅助病情分析报告：医生可输入病人健康数据摘要，选择报告周期（日、周、月等），AI会围绕饮食、运动、睡眠、药物、情绪、毒素六大支柱生成分析报告（简体中文）。
  - AI病情发展趋势预测：模拟展示高危病人病情发展趋势的AI预测。
- **治疗方案与建议**:
  - 个性化治疗方案：为特定病人查看和（模拟）制定药物管理、治疗计划、调整记录。
  - 治疗建议记录：查看和（模拟）记录治疗建议及病人执行情况。
- **医患沟通**:
  - 病人咨询管理：查看病人咨询列表，回复咨询（与病人端联动）。
  - 消息推送：向特定病人或群组推送消息（模拟）。
- **预约管理**: 查看、安排和修改患者的预约日历。
- **外呼计划管理**:
  - 单个病人外呼任务：制定、执行和跟踪针对单个病人的外呼。
  - 外呼组管理与任务：创建病人组，为组统一设置和执行外呼任务。
  - 外呼统计：查看外呼任务的执行情况、成功率等（模拟）。
- **统计报告**:
    - 病情趋势分析 (模拟图表)。
    - 治疗效果评估 (模拟图表与报告)。
    - 自定义统计报表 (模拟配置与生成)。
- **医生个人资料管理**: 查看和编辑医生个人信息。

### SAAS管理后台核心功能 (Next.js Version - PC管理后台风格):
- **企业管理 (医院管理)**: 管理SAAS平台中的企业或医院账户，包括账户创建、资源分配和基本信息配置。
- **部门管理 (医院科室管理)**: 针对每个企业/医院账户，管理其内部的部门或科室结构。
- **员工管理 (医院医生/员工管理)**: 管理企业/医院账户下的员工（如医生、护士、客服等）信息和系统访问权限。
- **客户中心 (医院病人管理)**: 查看和管理由各企业/医院服务的最终客户（病人）信息汇总。
- **服务中心**:
    - **服务包管理**: 创建、编辑和管理平台提供的各类服务包。
    - **订单管理**: 查看和管理企业/医院购买服务包的订单记录。
- **社群管理**: 管理员工负责的微信群，追踪聊天记录（模拟）和群成员健康互动。
- **SOP服务管理**: 管理中台扣子（Coze）、Dify等工作流的API相关内容。
- **外呼任务 (平台级)**: 设置和管理平台级别的自动或人工外呼任务。
- **系统管理 (SAAS平台)**:
    - **SAAS平台用户管理**: 管理SAAS平台自身的管理员用户账户。
    - **角色与权限管理**: 定义系统中的角色及其对应的操作权限。
    - **API接口管理**: 管理系统对外提供的API接口（模拟）。
    - **AI大语言模型设置**: 配置核心LLM的API密钥、端点、模型名称，以及管理外部AI工作流（Dify, Coze）的API配置。
    - **数据备份与恢复**: 模拟管理SAAS平台核心数据的备份与恢复。
    - **外部服务集成**: 模拟管理与外部服务的集成。
    - **平台参数设置**: 模拟配置SAAS平台的全局设置。
- **系统监控**:
    - **外部系统状态监控**: 模拟监控依赖的外部系统状态。
    - **在线用户列表**: 模拟实时获取在线用户数量和列表。
    - **后台定时任务管理**: 模拟管理和监控系统中的定时任务。

## 技术栈

- **主 Next.js 应用 (病人端 + 医生端 + SAAS管理后台)**: Next.js (App Router), React, TypeScript
- **Vue.js 前端 (病人端 - 新增)**: Vue 3, Vite, TypeScript, Vue Router, Pinia
- **UI**: Tailwind CSS, ShadCN UI (Next.js), Lucide React/Lucide-vue-next (图标), Recharts (图表 - Next.js)
- **状态管理 & 表单**: React Hook Form (Next.js), Zod (数据校验 - Next.js), Pinia (Vue.js)
- **后端 & 数据库**: Firebase (Firestore) - *注意: 当前项目主要为前端演示，Firestore集成较少，大部分数据为前端模拟。`db`目录下提供了关系型数据库的schema设计。*
- **AI 功能**: Genkit, Google AI (Gemini)
- **开发工具**: ESLint, Prettier, VSCode

## 项目结构 (概览)

- `src/`: 主 Next.js 应用。
  - `app/`: Next.js 主应用页面和布局。
    - `(auth)/`: 主应用认证相关页面 (病人端登录、注册)。
    - `dashboard/`: 病人端主要功能页面。
    - `doctor/`: 医生端主要功能页面。
    - `saas-admin/`: SAAS管理后台页面。
  - `components/`: 可复用UI组件 (病人端、医生端、SAAS后台共享或特定)。
    - `profile/`: 病人档案相关表单组件。
    - `doctor/`: 医生端特定组件。
    - `saas-admin/`: SAAS管理后台特定组件。
  - `lib/`: 工具函数、类型定义、导航链接等。
  - `ai/`: Genkit AI 相关代码 (flows, genkit.ts)。
  - `hooks/`: 自定义React Hooks。
  - `contexts/`: React Context API 相关代码 (如医生端认证)。
  - `db/`: 数据库schema定义 (`database_schema.md`, `schema.sql`)。
- `public/`: Next.js 主应用静态资源。
- `vue-patient-app/`: Vue.js 病人端应用 (独立项目结构)。
- `package.json`: 项目根目录的 `package.json`。

## 风格指南

- **主色**: 青色 (`#008080`) - 唤起平静和健康的感觉。
- **辅助色**: 浅灰色 (`#F0F0F0`) - 用于干净的背景。
- **强调色**: 天蓝色 (`#87CEEB`) - 用于互动元素。
- 干净和现代的排版，以增强可读性。
- 一致和清晰的图标，便于导航。
- 页面主体内容部分采用便当盒网格(BentoGrid)布局。

## 快速开始

### 环境要求

- Node.js (推荐 LTS 版本)
- npm 或 yarn 或 pnpm

### 安装依赖

在项目根目录运行:
```bash
npm install
```
这将安装主 Next.js 应用的依赖。Vue 应用有其独立的 `package.json`，其依赖也应通过此命令安装（如果已配置为工作区，否则需单独安装）。

### 配置环境变量

1.  复制 `.env.example` (如果存在) 为 `.env`。
2.  填入必要的环境变量，特别是 Firebase 和 Google AI (Genkit) 相关的配置。示例:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   # ... 其他Firebase配置 ...

   GOOGLE_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_API_KEY

   # 开发服务器URL (可选, next.config.js 中有默认值)
   # VUE_DEV_SERVER_URL=http://localhost:9003
   # SAAS_ADMIN_DEV_SERVER_URL=http://localhost:3000 # 注意：SAAS Admin已集成到主Next.js应用中
   ```
   **注意**: 将 `YOUR_...` 替换为您的实际配置值。

### 运行开发服务器

**主 Next.js 应用 (病人端React版 + 医生端 + SAAS管理后台):**
```bash
npm run dev
```
主 Next.js 应用默认运行在 `http://localhost:9002`。
- 病人端 (Next.js): `http://localhost:9002/dashboard` (登录后)
- 医生端: `http://localhost:9002/doctor` (登录后)
- SAAS管理后台: `http://localhost:9002/saas-admin` (登录后)

**Vue.js 病人端应用 (独立开发服务):**
```bash
npm run dev:vue
```
Vue.js 应用单独运行时，通常在 `http://localhost:9003/vue-patient-app/`。
通过主 Next.js 应用访问时，路径为 `http://localhost:9002/vue-patient-app/` (由 `next.config.js` 中的 `rewrites` 代理)。

**运行 Genkit 开发服务器 (AI功能):**
如果需要测试或开发AI相关功能，请在另一个终端运行：
```bash
npm run genkit:dev
# 或使用带热重载的：
npm run genkit:watch
```
Genkit 服务通常运行在 `http://localhost:3100` (Genkit UI 在 `http://localhost:4100`)。

### 构建与启动生产版本

**主 Next.js 应用:**
```bash
npm run build
npm run start
```

**Vue.js 病人端应用:**
```bash
npm run build:vue
```
Vue.js 应用的生产构建结果位于 `vue-patient-app/dist`。在生产环境中，这部分静态资源应由主 Next.js 应用通过反向代理或静态文件服务来提供，路径为 `/vue-patient-app/`。

## 更新到最新版本 (从 GitHub)

如果您已经克隆了此项目，并希望获取最新的更新，请在您本地项目根目录中执行以下步骤：

1.  确保您没有未提交的本地更改，或者已将它们储藏 (stash) 或提交。
    ```bash
    git status
    # 如果有未提交更改，请先处理：
    # git stash
    # 或者
    # git add .
    # git commit -m "我的本地修改"
    ```

2.  切换到您的主分支（通常是 `main`）：
    ```bash
    git checkout main
    ```

3.  从远程仓库 (`origin`) 拉取 `main` 分支的最新更改：
    ```bash
    git pull origin main
    ```
    (如果您的主分支是 `master`，请使用 `git pull origin master`)

4.  如果 `package.json` 或 `package-lock.json` (或 `yarn.lock` / `pnpm-lock.yaml`) 文件有变动，强烈建议重新安装或更新依赖项以确保所有包都是最新的：
    ```bash
    npm install
    ```
    (或者 `yarn install` / `pnpm install`，取决于您使用的包管理器)

5.  如果数据库结构 (`db/schema.sql`) 有更新，您可能需要相应地更新您的本地数据库。

6.  重新启动您的开发服务器：
    ```bash
    npm run dev
    # 以及其他需要的服务，如 Vue 开发服务器或 Genkit 服务器
    # npm run dev:vue 
    # npm run genkit:watch
    ```

## 推送到 GitHub

要将您的本地项目推送到 GitHub 仓库 `https://github.com/robinlincn/AIHealth.git`，请在您项目的根目录中使用终端或命令提示符执行以下步骤：

1.  **初始化 Git (如果尚未初始化):**
    ```bash
    git init
    ```

2.  **将所有文件添加到暂存区:**
    ```bash
    git add .
    ```

3.  **提交您的更改:**
    ```bash
    git commit -m "描述您的提交内容"
    ```

4.  **设置主分支名称 (对于新仓库是好习惯):**
    ```bash
    git branch -M main
    ```

5.  **添加远程仓库 (如果尚未添加):**
    ```bash
    git remote add origin https://github.com/robinlincn/AIHealth.git
    ```
    如果已存在名为 `origin` 的远程仓库但URL不正确, 可使用 `git remote set-url origin https://github.com/robinlincn/AIHealth.git` 更新。

6.  **将您的更改推送到 GitHub:**
    ```bash
    git push -u origin main
    ```

**重要提示:**
*   确保您的系统上已安装 Git。
*   首次推送时，您可能需要向 GitHub 进行身份验证。
*   您的 `.gitignore` 文件应配置为排除不应提交的文件和文件夹 (如 `node_modules`, 包含敏感密钥的 `.env` 文件, 构建输出等)。

---

欢迎为此项目贡献代码或提出建议！
