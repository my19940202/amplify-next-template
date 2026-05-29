# Amplify Next.js 项目迁移规划文档

> **目标**：将当前基于 AWS Amplify Gen 2 + AppSync GraphQL + DynamoDB 的项目，迁移为 **Next.js 原生 REST API + Supabase Postgres + Supabase Auth** 架构。
> **核心诉求**：去掉 GraphQL 抽象层、直接操作 PostgreSQL、用传统 REST 接口做 CRUD、Amplify 仅负责网站部署。

**文档状态**：v2.1（清理阶段已完成）  
**制定日期**：2026-05  
**最后更新**：2026-05 - 完成旧 Amplify 代码与依赖彻底清理  
**适用项目**：nextjs-supabase-todo（原 amplify-next-template）

> **实施进度**：核心迁移 + 清理全部完成。项目已完全切换到 Supabase + Next.js REST 架构。

---

## 1. 当前状态分析

### 1.1 现有技术栈

- **前端**：Next.js 14 (App Router) + React 18
- **后端数据**：AWS Amplify Gen 2 `defineData` → AppSync GraphQL + DynamoDB
- **认证**：Amazon Cognito（email 登录）
- **数据访问**：客户端直连（`generateClient<Schema>()` + `client.models.Todo`）
- **实时能力**：`observeQuery()`（当前唯一实时订阅）
- **部署**：AWS Amplify Hosting

### 1.2 核心问题（与用户诉求冲突）

- GraphQL 作为额外抽象层，用户希望直接写接口操作数据库
- DynamoDB 不符合“使用 PostgreSQL”的偏好
- 客户端直连数据库（通过 API Key）不符合生产安全实践
- 实时订阅能力在本项目中优先级低，可移除

### 1.3 保留价值

- Amplify Hosting 对 Next.js 的支持良好（SSR、API Routes 均可）
- Amplify Cognito 认证体系成熟，但本次迁移中**不保留**

---

## 2. 目标架构

### 2.1 最终技术栈


| 层级           | 技术选型                                      | 说明                       |
| ------------ | ----------------------------------------- | ------------------------ |
| 前端框架         | Next.js 14 (App Router)                   | 保持不变                     |
| 数据库          | Supabase Postgres                         | 外部托管 PostgreSQL          |
| API 层        | Next.js Route Handlers (`app/api/`)       | 传统 REST 风格               |
| ORM / Client | `@supabase/supabase-js` + `@supabase/ssr` | 轻量、无需学习 Prisma           |
| 认证           | Supabase Auth（Email + Password）           | 与数据库同厂商，未来可完美结合 RLS      |
| 部署           | AWS Amplify Hosting                       | 仅保留 Hosting 能力           |
| 类型系统         | Supabase 生成的 TypeScript 类型                | `npx supabase gen types` |


### 2.2 核心设计原则

1. **Server-First**：数据获取优先使用 Server Components + Route Handlers，彻底移除客户端直连数据库。
2. **REST 优先**：接口风格严格遵循 RESTful 设计（资源 + HTTP 方法）。
3. **Demo 阶段简化权限**：当前阶段暂不开启 Row Level Security (RLS)。权限校验在应用层通过 `user_id` 手动过滤实现。**生产上线前必须开启 RLS**。
4. **Amplify 最小化**：`amplify/` 目录大幅精简或移除后端资源定义，仅保留部署配置。
5. **渐进迁移**：先跑通核心 CRUD，再做认证切换，最后清理旧代码。

### 2.3 Demo 阶段安全说明（重要）

由于当前为示例项目（Demo 阶段），我们**暂时不开启 Supabase Row Level Security (RLS)**。

**当前做法**：

- 表创建时不执行 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- 所有数据隔离逻辑放在应用代码中（Route Handlers 里手动加 `user_id` 条件）
- 使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY` + 服务端 `getUser()` 即可满足基本演示需求

**后续必须做的事**（生产上线前）：

- 启用 RLS 并创建严格的策略
- 把应用层的 `user_id` 过滤作为第二道防线（纵深防御）
- 考虑是否使用 `service_role` key 做后台管理操作

这个决策是为了让你在 Demo 阶段能更快看到效果，减少心智负担。所有代码结构都会为后续开启 RLS 做好准备。

---

## 3. 目标目录结构

```
amplify-next-template/
├── app/
│   ├── api/                          # ★ 新增：REST API 层（核心）
│   │   ├── todos/
│   │   │   ├── route.ts              # GET(list) + POST(create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET / PATCH / DELETE
│   │   └── auth/                     # 可选：登录/注册/登出接口（如需要）
│   │       ├── login/
│   │       └── ...
│   │
│   ├── (auth)/                       # 认证相关页面路由组（可选）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── layout.tsx                    # 全局布局（会加入 AuthProvider 或用户信息）
│   ├── page.tsx                      # 首页（改用 Server Component 取数据）
│   └── globals.css
│
├── lib/
│   └── supabase/                     # ★ 新增：Supabase 客户端工具
│       ├── client.ts                 # 浏览器端 client（用于客户端组件）
│       ├── server.ts                 # 服务端 client（最重要，用于 Route Handler / Server Component）
│       └── middleware.ts             # 中间件（自动刷新 session）
│
├── middleware.ts                     # ★ 新增：根中间件（保护路由 + Supabase session）
│
├── types/
│   └── supabase.ts                   # Supabase 自动生成的数据库类型
│
├── .env.local                        # ★ 本地开发环境变量（Supabase 配置放这里，**不要提交**）
├── .env.example                      # 环境变量示例模板（提交到 git）
│
├── amplify.yml                       # ★ 修改：确保 Supabase 环境变量在 SSR 阶段可用
├── amplify_outputs.json              # 迁移完成后可删除（或保留做参考）
│
├── amplify/                          # ★ 大幅精简
│   ├── backend.ts                    # 可简化为仅保留 Hosting 配置或完全删除
│   └── (auth/ 目录删除)
│   └── (data/ 目录删除)
│
├── public/
├── package.json
└── MIGRATION_PLAN.md                 # 本文档
```

**说明**：

- `app/api/todos/` 是本次迁移后**最主要的业务代码入口**。
- `lib/supabase/server.ts` 是整个后端数据访问的唯一入口。
- 不再有 `amplify/data/resource.ts` 这种中间定义层。

---

## 4. 详细迁移阶段规划（推荐执行顺序）

### Phase 0：准备工作（Supabase 项目 & 数据库）

**目标**：拥有一个可用的 Supabase 项目和基础表结构。

**具体任务**：

1. 注册/登录 Supabase，创建一个新项目（推荐区域选离用户近的）。
2. 在 Supabase Dashboard → SQL Editor 中创建表（**Demo 阶段暂不开启 RLS**）：

```sql
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Demo 阶段暂不开启 RLS（简化开发）
-- 生产环境上线前必须启用 RLS + 策略！
-- ============================================
-- alter table public.todos enable row level security;
--
-- create policy "Users can view own todos"
--   on public.todos for select
--   using (auth.uid() = user_id);
--
-- ...（其他策略）
```

1. 在 Supabase Dashboard → Authentication → Providers 中开启 **Email** 登录（开发阶段建议关闭 email 确认，方便测试）。
2. 运行类型生成命令（后续会在代码中集成）：
  ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > types/supabase.ts
  ```

**交付物**：

- Supabase 项目 URL + anon key + service_role key
- 基础 `todos` 表（RLS 策略暂未开启）

---

### Phase 1：依赖安装与 Supabase 客户端初始化

**目标**：项目具备与 Supabase 通信的基础能力。

**具体任务**：

1. 安装必要依赖：
  ```bash
   npm install @supabase/supabase-js @supabase/ssr
  ```
2. 创建 `lib/supabase/` 目录及三个核心文件：
  - `client.ts`（浏览器端）
  - `server.ts`（服务端，含 cookie 处理）
  - `middleware.ts`（用于根中间件）
3. 在项目根创建 `middleware.ts`，实现：
  - 自动刷新 Supabase session
  - 受保护路由的简单守卫（可选）
4. 创建 `.env.example`，列出所有需要的环境变量。

**环境变量配置方式**：

- **本地开发**：所有 Supabase 配置统一放在项目根目录的 `.env.local` 文件中（**不要提交到 git**）。
- **生产部署（Amplify）**：通过 Amplify Console 的 Environment variables + `amplify.yml` 注入（详见 Phase 5）。

**推荐的 `.env.local` 内容**：

```env
# Supabase 配置（从 Supabase Dashboard → Project Settings → API 获取）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 服务端专用（Route Handlers / Server Components 中使用，可选）
# Demo 阶段可先不配置，使用 anon key 即可
SUPABASE_SERVICE_ROLE_KEY=
```

> **注意**：`NEXT_PUBLIC_` 前缀的变量会暴露到浏览器，其余变量仅在服务端可用。

---

### Phase 2：认证系统切换（Supabase Auth）

**目标**：实现完整的登录、注册、登出流程，并替换原有 Cognito。

**具体任务**：

1. 创建认证相关页面（推荐使用路由组 `(auth)`）：
  - `/login`
  - `/register`
2. 使用 Supabase SSR client 实现：
  - Server Actions 或 Route Handlers 处理登录/注册/登出
  - 表单提交后使用 `supabase.auth.signInWithPassword` / `signUp`
3. 在根 `layout.tsx` 中集成用户信息获取（使用 `createClient` 从服务端获取当前用户）。
4. 实现受保护路由：
  - 中间件层：未登录用户重定向到 `/login`
  - 页面层：Server Component 中校验 `await supabase.auth.getUser()`
5. 清理原有 Amplify Auth 配置代码（`Amplify.configure` 中的 auth 部分）。

**注意**：当前项目没有复杂的用户表，迁移后用户体系将完全由 Supabase Auth 管理。

---

### Phase 3：实现 REST API 层（核心业务）

**目标**：用传统 REST 风格完成 Todo 的完整 CRUD。

**推荐接口设计**（严格 REST）：


| 方法     | 路径                | 功能                   | 返回                  |
| ------ | ----------------- | -------------------- | ------------------- |
| GET    | `/api/todos`      | 获取当前用户所有 todos       | `{ todos: [...] }`  |
| POST   | `/api/todos`      | 创建新 todo             | `{ todo: {...} }`   |
| GET    | `/api/todos/[id]` | 获取单个 todo            | `{ todo: {...} }`   |
| PATCH  | `/api/todos/[id]` | 更新 todo（目前仅 content） | `{ todo: {...} }`   |
| DELETE | `/api/todos/[id]` | 删除 todo              | `{ success: true }` |


**实现要点**（Demo 阶段，无 RLS）：

- 所有接口内部使用 `lib/supabase/server.ts` 创建服务端 client
- 必须校验当前登录用户：`const { data: { user } } = await supabase.auth.getUser()`
- **数据隔离通过应用层实现**：
  - 查询列表时手动加上 `where user_id = 当前用户ID`
  - 创建时强制写入 `user_id = 当前用户ID`
  - 更新/删除时额外校验 `user_id` 是否匹配
- 错误处理统一返回 JSON + 合适 HTTP 状态码
- 类型使用 `Database` 从 `types/supabase.ts` 导入

> **重要提醒**：Demo 阶段用应用层过滤是为了快速验证功能。**正式上线前必须开启 RLS**，并把应用层过滤作为第二道防线。

**可选增强**（Phase 3 后期或 Phase 4）：

- 添加简单的分页（`limit` + `offset`）
- 添加搜索（`content.ilike.%keyword%`）

---

### Phase 4：前端页面重构

**目标**：把原来纯客户端的 Todo 应用改造成 Server-First 模式。

**具体任务**：

1. `app/page.tsx`：
  - 改为 async Server Component
  - 在服务端直接调用内部 API 或直接使用 Supabase server client 获取数据（推荐后者，减少一层网络）
  - 保留“新建”按钮，表单提交走 POST `/api/todos`
2. 列表渲染保持简单（当前项目风格）
3. 删除或大幅简化原来 `page.tsx` 中的 `use client` + `generateClient` 代码
4. 新增/编辑操作改用 `<form action={...}>` 或 `fetch` 调用 REST 接口 + `revalidatePath`

**实时性处理**：本次不实现实时更新。如未来需要，可在客户端组件中使用 Supabase Realtime 单独订阅。

---

### Phase 5：Amplify Hosting 配置调整

**目标**：确保 Supabase 环境变量在 Amplify 的 SSR 环境中正确可用。

**具体任务**：

1. 更新项目根 `amplify.yml`：
  - 在 `build` 阶段把 Supabase 相关环境变量写入 `.env.production`
  - 示例片段见附录
2. 在 AWS Amplify Console → 对应应用 → Environment variables 中添加：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - （如后续需要）`SUPABASE_SERVICE_ROLE_KEY`
3. 触发一次新构建，验证 SSR 页面能正常拿到数据。

**重要**：Amplify Hosting 的 SSR 环境变量注入机制与本地 `.env.local` 不同，必须通过 `amplify.yml` 显式处理。

---

### Phase 6：旧代码清理与 Amplify 精简

**目标**：彻底移除 GraphQL 相关代码，精简 Amplify 目录。

**可删除内容**：

- `amplify/data/` 整个目录
- `amplify/auth/resource.ts`（如决定不再使用 Cognito）
- `amplify_outputs.json`（可先备份，确认无误后删除）
- `app/page.tsx` 中所有 `aws-amplify` 相关 import 和配置
- `package.json` 中 `@aws-amplify/ui-react`、`aws-amplify`（如完全不用）

**保留内容**：

- `amplify.yml`（用于 Hosting 配置）
- `amplify/backend.ts`（可简化为最小形式，或在确认不需要后删除整个 `amplify/` 目录）

**验证**：删除后本地 `npm run build` 仍能通过，Amplify 部署也正常。

---

### Phase 7：测试、文档与部署

**测试清单**：

- 本地开发：注册 → 登录 → 新建 Todo → 查看列表 → 编辑 → 删除
- 未登录用户无法访问首页（被中间件或页面重定向）
- 一个用户看不到另一个用户的 Todo（应用层通过 `user_id` 过滤实现）
- Amplify 部署后功能完全正常
- 刷新页面后登录状态保持
- 记录当前 Demo 阶段未开启 RLS，待后续补充

**文档更新**：

- 更新 `README.md`，说明新的技术栈和本地启动方式
- 补充 Supabase 本地开发可选方案（使用 Supabase CLI）

---

## 5. 风险与权衡


| 风险 / 权衡                       | 影响  | 缓解措施                                             |
| ----------------------------- | --- | ------------------------------------------------ |
| 切换 Auth 导致原有用户数据丢失            | 中   | 本项目为示例模板，成本极低；生产项目需做用户迁移                         |
| Amplify Hosting SSR 环境变量注入较麻烦 | 低   | 已明确在 Phase 5 重点处理                                |
| 失去 Amplify 自动实时订阅能力           | 低   | 用户明确实时性要求低；未来可按需加 Supabase Realtime              |
| Supabase 免费额度限制               | 低   | 当前 Todo 场景极轻量，远低于限制                              |
| 未来想换回自管 RDS                   | 中   | 迁移成本存在，但 Supabase Postgres 本身就是标准 PostgreSQL，可导出 |


---

## 6. 回滚策略

- 保留当前 `main` 分支不变
- 本次迁移在独立分支 `feature/supabase-migration` 上进行
- 每个 Phase 完成后提交，便于逐段回滚
- 如中途发现严重问题，可快速切回 `main` 并继续用原有 Amplify 方案

---

## 7. 后续演进建议（本次不实施）

- 引入 Server Actions 作为部分表单的补充（当前先纯 REST）
- 增加 Drizzle ORM（轻量级，比 Prisma 学习成本低）
- 接入 Supabase Storage（如果未来有文件上传需求）
- 接入 Supabase Edge Functions 做复杂业务逻辑
- 增加 TanStack Query 做客户端缓存与乐观更新

---

## 附录 A：amplify.yml 推荐修改片段（Phase 5）

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - |
          echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" >> .env.production
          echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> .env.production
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

## 附录 B：推荐的本地开发 Supabase 方式

**方式一（推荐新手）**：直接使用云端 Supabase 项目（不同环境用不同 Project）。

**方式二（进阶）**：安装 Supabase CLI + Docker，本地启动完整 Supabase 栈，体验与生产一致。

```bash
npm install supabase --save-dev
npx supabase init
npx supabase start
```

本地会提供独立的 URL 和 keys，与云端项目完全隔离。

---

## 附录 C：成功标准（Done Definition）

1. 用户可以在新架构下完成完整的 Todo 增删改查
2. 不同用户数据在应用层实现隔离（通过 `user_id` 过滤；**注意**：Demo 阶段未开启 RLS）
3. 登录态在页面刷新后保持
4. Amplify 部署后功能与本地一致
5. 代码中不再出现任何 GraphQL / AppSync / DynamoDB 相关引用
6. 项目启动命令保持 `npm run dev`，无额外复杂步骤
7. 文档中清晰记录“生产前必须开启 RLS”这一待办事项

---

**文档结束**

---

## 实施日志

- **2026-05**：规划 v1.2 完成，正式从 **Phase 0 开始实施**。
- 已创建 `.env.example` 文件。
- 用户完成 Supabase 项目创建、表结构准备，并提供密钥。

**Phase 0 完成情况**：

- Supabase 项目已创建（项目 ID: snjygwmdbdahlrtegnnb）
- `todos` 表已创建（暂未开启 RLS）
- Email 认证已开启
- 密钥已正确配置到 `.env.local`（`.env.example` 已还原为安全模板）

**Phase 1 实施记录**（已完成）：

- 安装依赖：`@supabase/supabase-js` + `@supabase/ssr`
- 创建 `lib/supabase/` 目录：
  - `client.ts`（浏览器端）
  - `server.ts`（服务端核心）
  - `middleware.ts`（中间件辅助）
- 创建根目录 `middleware.ts`
- 创建 `types/supabase.ts`（临时占位类型，后续可通过命令生成真实类型）

**Phase 2 实施记录**（已完成）：

- 更新 middleware 实现完整路由保护（未登录跳转 /login，已登录访问登录页自动跳转首页）
- 创建 REST 风格认证接口：
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- 创建认证页面（使用路由组 `(auth)`）：
  - `/login`（登录页）
  - `/register`（注册页）
- 临时重构首页 `app/page.tsx` 为受保护的占位页（显示当前用户信息 + 退出按钮），真实 Todo 功能将在 Phase 4 迁移
- 移除页面对旧 Amplify 客户端的直接依赖
- 完整构建验证通过

**Phase 3 实施记录**（已完成）：
- 实现完整 Todo REST API：
  - `GET /api/todos` - 列表（按当前用户过滤）
  - `POST /api/todos` - 创建
  - `GET /api/todos/[id]` - 获取单个
  - `PATCH /api/todos/[id]` - 更新 content
  - `DELETE /api/todos/[id]` - 删除
- 所有接口均：
  - 使用 `lib/supabase/server.ts` 获取当前用户
  - 在应用层通过 `user_id` 做数据隔离（Demo 阶段无 RLS）
  - 返回统一 JSON 结构
- 使用 `@ts-ignore` / `as any` 临时绕过占位类型限制（后续生成真实 Supabase 类型后可清理）
- 完整 `npm run build` 通过

**Phase 4 实施记录**（已完成）：
- 重构 `app/page.tsx` 为 async Server Component
  - 服务端直接使用 Supabase client 查询当前用户的 todos（性能最佳）
  - 传递初始数据给客户端组件
- 新建 `app/todos-client.tsx`（Client Component）负责所有交互：
  - 新建 Todo（调用 POST /api/todos）
  - 点击列表项编辑（调用 PATCH /api/todos/[id]）
  - 删除按钮（调用 DELETE /api/todos/[id]）
  - 操作成功后使用 `router.refresh()` 同步服务端数据
- 保留原有视觉风格（紫色渐变背景、黑色列表边框等）
- 优化全局样式：登录/注册页保持居中，主应用页面支持长列表滚动
- 在主页面顶部显示当前登录邮箱 + 退出登录按钮
- `npm run build` 完全通过

**清理阶段实施记录**（已完成）：
- 备份并删除：
  - `amplify_outputs.json` → `amplify_outputs.json.bak`
  - 整个 `amplify/` 目录（已彻底删除，旧备份已移除以避免 TypeScript 扫描）
- 更新 `package.json`：
  - 移除所有 Amplify 相关依赖（aws-amplify、@aws-amplify/*、aws-cdk*、constructs、esbuild、tsx 等）
  - 项目名称改为 `nextjs-supabase-todo`
- 执行 `npm install`，自动移除 1591 个旧 Amplify 包
- 彻底删除 `amplify-old/` 文件夹，确保 TypeScript 构建干净无残留
- 更新 `.gitignore`，注释掉 Amplify 相关忽略规则
- 保留 `amplify.yml`（用于未来 Amplify Hosting 部署时的构建配置）
- `npm run build` 验证通过，项目干净轻量

**最终状态**：
- 完全移除 GraphQL / AppSync / DynamoDB / Cognito
- 采用 Supabase Postgres + Supabase Auth + Next.js REST API
- 代码结构清晰、依赖精简

> 每个 Phase 完成后，我会更新本文档的「实施日志」并给出下一阶段的具体操作指引。

