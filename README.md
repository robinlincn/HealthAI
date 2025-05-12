
# AI慢病管理系统 (AI Chronic Disease Management System)

本项目是一个基于Next.js开发的AI慢病管理系统，旨在为患者提供个性化的慢性病管理方案、健康建议和持续支持，同时为医生提供高效的病人管理、病情分析和治疗辅助工具。

## 主要特性

系统包含三大主要部分：**病人端 (手机App风格)**, **医生端 (PC管理后台)**, 和 **SAAS管理后台**。

### 病人端核心功能 (Next.js Version):

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

### 病人端核心功能 (Vue.js Version - In Development):
一个使用 Vue.js 3, Vite, Pinia, 和 Tailwind CSS 构建的病人端应用正在开发中。它旨在复制 Next.js 版本的功能和风格。
- 目录: `vue-patient-app/`
- 主要技术: Vue 3, Vite, Vue Router, Pinia, Tailwind CSS, Lucide-vue-next
- 当前状态: 基础结构和部分页面已搭建。

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
- **外呼计划管理**:
  - 单个病人外呼任务：制定、执行和跟踪针对单个病人的外呼。
  - 外呼组管理与任务：创建病人组，为组统一设置和执行外呼任务。
  - 外呼统计：统计外呼任务的执行情况、成功率等。
- **系统管理 (医生端)**:
  - 医生个人资料管理。
  - （原医生端“系统管理”下的用户权限、数据备份等功能已移至SAAS管理后台）

### SAAS管理后台核心功能:
- **企业管理 (医院管理)**: 管理SAAS平台中的企业或医院账户，包括账户创建、资源分配和基本信息配置。
- **部门管理 (医院科室管理)**: 针对每个企业/医院账户，管理其内部的部门或科室结构。
- **员工管理 (医院医生/员工管理)**: 管理企业/医院账户下的员工（如医生、护士、客服等）信息和系统访问权限。
- **客户中心 (医院病人管理)**: 查看和管理由各企业/医院服务的最终客户（病人）信息汇总。
- **服务中心**:
    - **服务包管理**: 创建、编辑和管理平台提供的各类服务包，并配置其权限。
    - **订单管理**: 查看和管理企业/医院购买服务包的订单记录。
- **社群管理**: 记录和管理微信群聊天记录和日志，包括个人微信群和企业微信群。
- **SOP服务管理**: 管理中台扣子（Coze）、Dify等工作流的API相关内容，优化调用流程。
- **外呼任务 (平台级)**: 设置和管理平台级别的自动或人工外呼任务，用于客户回访、业务推广、通知提醒等。
- **系统管理 (SAAS平台)**:
    - **用户管理**: 管理SAAS平台自身的管理员用户账户。
    - **权限管理**: 定义系统中的角色及其对应的操作权限。
    - **API管理**: 管理系统对外提供的API接口。
    - **数据备份与恢复**: 管理SAAS平台核心数据的备份与恢复。
    - **集成与扩展**: 管理与外部服务（如AI模型、分析工具）的集成。
    - **系统设置**: 配置SAAS平台的全局设置。
- **系统监控**:
    - **外部系统状态监控**: 监控依赖的外部系统（如影刀、微信服务等）是否正常。
    - **在线用户**: 实时获取SAAS平台当前在线用户数量和列表。
    - **定时任务管理**: 管理和监控系统中的定时任务。

## 技术栈

- **主 Next.js 前端 (病人端 + 医生端)**: Next.js (App Router), React, TypeScript
- **SAAS 管理后台**: Next.js (App Router), React, TypeScript (位于 `src/app/saas-admin/` 目录)
- **Vue.js 前端 (病人端 - 新增)**: Vue 3, Vite, TypeScript, Vue Router, Pinia (位于 `vue-patient-app/` 目录)
- **UI**: Tailwind CSS, ShadCN UI (Next.js), Lucide React/Lucide-vue-next (图标), Recharts (图表 - Next.js)
- **状态管理 & 表单**: React Hook Form (Next.js), Zod (数据校验 - Next.js), Pinia (Vue.js)
- **后端 & 数据库**: Firebase (Firestore)
- **AI 功能**: Genkit, Google AI (Gemini)
- **开发工具**: ESLint, Prettier, VSCode

## 项目结构 (概览)

- `src/`: 主 Next.js 应用 (病人端 React 版 + 医生端 + SAAS管理后台)。
  - `app/`: Next.js 主应用页面和布局。
    - `(auth)/`: 主应用认证相关页面 (病人端登录、注册)。
    - `dashboard/`: 病人端主要功能页面。
    - `doctor/`: 医生端主要功能页面。
    - `saas-admin/`: SAAS管理后台页面。
  - `components/`: Next.js 主应用可复用UI组件 (病人端、医生端、SAAS后台共享或特定)。
  - `lib/`: Next.js 主应用工具函数、类型定义等。
  - `ai/`: Genkit AI 相关代码。
  - `hooks/`: Next.js 主应用自定义React Hooks。
  - `contexts/`: React Context API 相关代码。
- `public/`: Next.js 主应用静态资源。
- `vue-patient-app/`: Vue.js 病人端应用 (独立项目结构)。
  - `public/`: Vue app 静态资源。
  - `src/`: Vue app 源代码。
  - `vite.config.ts`, `tailwind.config.js`, 等 Vue 项目配置文件。
- `package.json`: 项目根目录的 `package.json`，管理主应用和工作区脚本。

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

在项目根目录运行:
```bash
npm install
```
这将同时安装主 Next.js 应用的依赖。Vue 应用有其各自的 `package.json` 文件，如果需要单独管理它的依赖，可以进入相应目录操作：
```bash
cd vue-patient-app
npm install
cd ..
```

### 配置环境变量

1. 复制 `.env.example` (如果存在) 为 `.env`。
2. 填入必要的环境变量，特别是 Firebase 和 Google AI (Genkit) 相关的配置。示例:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

   GOOGLE_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_API_KEY
   ```
   **注意**: 将 `YOUR_...` 替换为您的实际配置值。
   - 主 Next.js 应用会直接使用这些环境变量。
   - Vue.js 应用可能需要通过 Vite 的环境变量机制 (例如，使用 `VITE_` 前缀) 来访问这些值。

### 运行开发服务器

**主 Next.js 应用 (病人端React版 + 医生端 + SAAS管理后台):**
```bash
npm run dev
```
主 Next.js 应用默认运行在 `http://localhost:9002`。
SAAS 管理后台将通过 `http://localhost:9002/saas-admin/` 路径访问。

**Vue.js 病人端应用:**
```bash
npm run dev:vue
```
Vue.js 应用通常运行在 `http://localhost:9003`。通过主应用访问时，路径为 `http://localhost:9002/vue-patient-app/`。

**确保所有开发服务器都已启动，以便通过主应用 (`http://localhost:9002`) 的代理访问 Vue 病人端。**

### 运行 Genkit 开发服务器 (AI功能)

如果需要测试或开发AI相关功能，请在另一个终端运行：
```bash
npm run genkit:dev
# 或使用带热重载的：
npm run genkit:watch
```
Genkit 服务通常运行在 `http://localhost:3100` (Genkit UI 在 `http://localhost:4100`)。

### 构建生产版本

**主 Next.js 应用 (病人端React版 + 医生端 + SAAS管理后台):**
```bash
npm run build
```

**Vue.js 病人端应用:**
```bash
npm run build:vue
```

### 启动生产服务器

**主 Next.js 应用:**
```bash
npm run start
```
主应用默认在 `http://localhost:9002` (或 `next start` 指定的端口) 启动。

**Vue.js 病人端应用:**
Vue.js 应用的生产部署通常涉及将 `vue-patient-app/dist` 目录的内容部署到静态文件服务器，或集成到主 Next.js 应用的 `public` 目录并通过重写规则提供服务。

**生产环境部署时，需要配置反向代理 (如 Nginx) 来处理主应用 (`/`)、Vue病人端 (`/vue-patient-app/`) 和 SAAS后台 (`/saas-admin/`) 的路由，将它们指向各自运行的生产服务。**

## 代码质量与检查

- **主 Next.js 应用 Linting**: `npm run lint`
- **主 Next.js 应用 Type Checking**: `npm run typecheck`
- **Vue.js 应用**: 进入 `vue-patient-app` 目录运行其 `package.json` 中的 lint 和 type check 脚本。

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
    git commit -m "Initial commit" 
    # 如果您正在更新现有仓库，请使用更具描述性的消息
    ```

4.  **设置主分支名称 (可选，但对于新仓库是好习惯):**
    ```bash
    git branch -M main
    ```

5.  **添加远程仓库:**
    *(如果您已经添加了此远程仓库，可能会收到 "remote origin already exists" 的错误。您可以跳过此步骤，或使用 `git remote set-url origin https://github.com/robinlincn/AIHealth.git` 来更新它。)*
    ```bash
    git remote add origin https://github.com/robinlincn/AIHealth.git
    ```

6.  **将您的更改推送到 GitHub:**
    ```bash
    git push -u origin main
    ```

    如果在添加远程仓库并尝试推送后遇到类似 "src refspec main does not match any" 的错误，请确保您已提交更改并且您的本地分支确实名为 `main`。如果您的本地分支是 `master`，请使用 `git push -u origin master`。

**重要提示:**
*   确保您的系统上已安装 Git。
*   首次推送时，您可能需要向 GitHub 进行身份验证 (例如，使用个人访问令牌或 SSH 密钥)。
*   如果您要更新现有仓库，请将 `"Initial commit"` 替换为相关的提交消息。
*   您项目根目录中的 `.gitignore` 文件应配置为排除不应提交的文件和文件夹 (如 `node_modules`、包含敏感密钥的 `.env` 文件、构建输出等)。请检查您的 `.gitignore` 文件。

---

欢迎为此项目贡献代码或提出建议！
