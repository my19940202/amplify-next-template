✅ 开店选址分析器（Store Location Analyzer）海外版 MVP 功能设计
面向海外个人创业者、小商家、加盟商和 side-project 创业者。核心差异化（参考 竞品分析.md）：比 Placer.ai / Buxton 更轻、更快、更便宜——Google Maps 驱动、3 分钟出报告、Freemium 友好，不做企业级 GIS 平台。
技术栈：Next.js App Router + Google Maps JS API（Places、Geocoding、Street View）+ Supabase（用户/报告存储，可选）。

---
4. MVP 页面范围与路由
暂时无法在飞书文档外展示此内容
用户主路径：首页 / → 点击 CTA → /map 工作台 → 搜索/选点 → 查看评分卡片 → 导出报告。

---
1. MVP 功能列表（1–2 个月 solo 可完成）
核心原则：傻瓜式地图可视化 + 基础评分 + 一键报告；首页负责获客与 SEO，功能页负责分析与转化。
1.1 首页（/）— 营销与 SEO
- Hero 介绍文案 + 主 CTA 按钮（跳转 /map）
- 痛点与价值主张段落
- SEO 正文段落（嵌入核心关键词，供爬虫与用户阅读）
- How It Works 三步流程
- 核心功能亮点（带示意图/截图位）
- 用户好评 / Testimonials
- Pricing 预览 + FAQ
- Footer 二次 CTA
1.2 功能页（/map）— 地图工作台
- 全屏 Google Map 作为底层画布（100vw × 100vh，参考现有 [app/map/layout.tsx](../app/map/layout.tsx)）
- 左侧 menu 面板覆盖在地图上（非左右分栏挤占地图），半透明/卡片式浮层
- 顶栏：页面标题、搜索框、视图切换占位（Kanban / List / Map，MVP 默认 Map + Kanban 列）
- 候选站点卡片列：按阶段/状态分组（如 Searched → Review → LOI，MVP 可简化为「待分析 / 已分析」）
- 单卡片：地址、Score、迷你趋势、状态标签（Bad / OK / Good / Great）
- 点击卡片：地图定位 marker + 侧边详情（竞品、客流、设施摘要）
- Street View 入口、一键导出报告按钮
- 「+ Add a site」添加入口
1.3 分析能力（功能页内触发）
- 地址/商圈搜索：Geocoding + Places Autocomplete；支持拖拽地图选点
- 周边分析：
  - 竞争对手：同类型 POI 密度、距离、Google 评分
  - 客流估算：基于附近 POI（写字楼/住宅/学校/地铁等）的规则加权
  - 配套设施：停车、公交、餐饮配套等
- 评分系统：1–10 分或 0–100 分，维度含人流潜力、竞争强度、可见度（Distance Matrix + Places 规则/轻量 AI）
- Street View 预览：判断门头可见度
- 报告导出：PDF/HTML（地图截图 + 数据摘要 + 建议）
1.4 商业化边界（MVP）
暂时无法在飞书文档外展示此内容
1.5 Phase 2（反馈后迭代，不纳入 MVP 首版）
- 多地点对比表格
- 垂直行业过滤（coffee shop / retail / restaurant / gym）
- 人口/收入叠加层（公开数据集）
- 保存项目 & 小团队共享
- 独立报告页 /report/[id]
可行性：一人可控；差异化在「个人友好 + 极简 UI + 快速决策」，严格监控 Google API 用量。

---
2. 首页设计（/）
采用经典 SaaS 落地页：痛点 → 演示 → 信任 → CTA，移动端优先，所有主按钮指向 /map。
2.1 Hero Section（首屏）
暂时无法在飞书文档外展示此内容
2.2 痛点与价值主张
Opening a store is risky — studies show a large share of retail failures tie back to poor location choice. Manually checking competitors on Google Maps is slow and inconsistent; enterprise tools like Placer.ai cost thousands per year. Store Location Analyzer gives solo founders and small businesses a lightweight, map-first way to score sites in minutes.
2.3 SEO 正文段落（页面中部，<section> + 语义化标题）
供搜索引擎与深度阅读用户，自然嵌入关键词：
段落 A — 工具定位
Store location analyzer tools help entrepreneurs compare retail site selection options before signing a lease. Our shop location planner uses live Google Maps data to surface competitor density, foot traffic proxies, and street-level visibility — so you can answer “best location for new store” with data, not guesswork.
段落 B — 使用场景
Whether you are opening a coffee shop, boutique retail store, or local service business, site selection for small business comes down to trade-offs: visibility vs. rent, traffic vs. competition. Use our store location analysis tool to run a competitor analysis for new store locations, estimate foot traffic potential from nearby POIs, and avoid common store location mistakes.
段落 C — 与免费方案对比
Many founders still rely on Google Maps alone or spreadsheets. A dedicated map based store finder tool adds scoring, repeatable reports, and side-by-side candidates — a practical free store location analysis tool tier lets you validate demand before upgrading.
On-page SEO 要点：
- <title>：Store Location Analyzer | Retail Site Selection Tool
- <meta description>：含 store location analyzer、retail site selection、Google Maps
- 单页 H1 唯一；H2 覆盖 How It Works、Features、Reviews、Pricing、FAQ
- 内部链接：FAQ / 博客 teaser 链到 /map
2.4 How It Works（#how-it-works）
1. Enter an address or drop a pin on the map workspace.
2. Get instant insights — competitors, traffic proxies, amenities.
3. Receive a score & export a report — share with partners or landlords.
可选：嵌入静态地图预览图或 GIF，按钮 Open Map Workspace → /map。
2.5 核心功能亮点
暂时无法在飞书文档外展示此内容
2.6 用户好评（Testimonials）
MVP 可用早期用户/占位文案，结构统一：引用 + 姓名 + 角色 + 城市 + 行业。
暂时无法在飞书文档外展示此内容
底部 CTA：Start Your Free Analysis → /map。
2.7 Pricing 预览
- Free：3 analyses/month，基础评分 + 报告
- Pro：$19–49/mo，无限分析、高级报告、历史记录（Phase 2 对比功能）
- One-time report：按需单次付费（可选）
2.8 FAQ（SEO + 转化）
示例问题（每条 2–3 句回答，并链向 /map）：
- What is a store location analyzer?
- How is this different from Google Maps alone?
- Is there a free store location analysis tool?
- Which businesses benefit most (coffee shop, retail, gym)?
- How accurate is foot traffic estimation?
2.9 Footer CTA
重复主文案 + Try Free Analysis → /map；Footer 链接：Privacy、Terms、Contact。
设计建议：Tailwind + 留白 + 地图视觉；Hero 与 Footer 双 CTA A/B 测试。

---
3. 功能页设计（/map）— 地图工作台
参考 Deal Dashboard 截图：底层全屏地图，左侧 menu/面板浮层覆盖，而非把地图挤到右侧小窗。
3.1 布局结构
┌─────────────────────────────────────────────────────────────┐
│ [可选] 极窄图标导航栏 │  左侧 Menu 面板（覆盖层）  │  地图全屏背景  │
│  48–64px            │  320–420px 宽，可滚动      │  Google Map   │
│                     │  圆角卡片 + 阴影           │  100vw×100vh  │
└─────────────────────────────────────────────────────────────┘
层级（z-index）：
1. z-0：Google Map 容器（[app/map/page.tsx](../app/map/page.tsx) 中 mapRef 全尺寸）
2. z-10：左侧 Menu 面板（position: absolute; left: 16px; top: 16px;）
3. z-20：顶栏工具条（搜索、视图切换、导出）
4. z-30：卡片详情抽屉 / Street View 模态
现有实现已有左侧浮层雏形（place details aside），MVP 需扩展为完整工作台而非仅单点详情。
3.2 左侧 Menu 面板模块
暂时无法在飞书文档外展示此内容
3.3 站点卡片字段
暂时无法在飞书文档外展示此内容
交互：
- 点击卡片 → 地图 flyTo + 打开 marker InfoWindow
- 选中态：卡片边框高亮 + 右侧/底部展开分析摘要（竞品数、客流分、设施分）
- 拖拽改列（Phase 2）；MVP 可用下拉改 stage
3.4 顶栏工具条（面板上方或面板内顶部）
- Download Report / Export PDF
- New Analysis（清空或新增站点）
- 视图切换图标（Kanban / List / Map）
3.5 地图层行为
- 默认中心：用户上次位置或 IP 推断城市（MVP 可用固定 demo 城市）
- Marker：与卡片列表双向同步
- 点击地图空白：Add pin here → 创建新站点卡片
- Street View：卡片操作项打开 Panorama 或新 tab
3.6 分析详情（选中站点后，面板内展开）
- Competition：半径内同类 POI 数量、最近 5 家名称与评分
- Foot traffic proxy：写字楼/住宅/Transit 加权分
- Amenities：停车、公交、餐饮配套条
- Overall score + 一句话建议（规则模板即可）
- Actions：Street View · Export Report · Remove site
3.7 响应式
暂时无法在飞书文档外展示此内容

---
4. SEO 关键词与内容映射
聚焦高意图商业词，优先美国、UK、加拿大、澳大利亚。
核心主关键词（首页 title/H1/SEO 段落）：
- retail site selection
- best location for new store
- business site selection
- foot traffic analyse
高价值长尾词（FAQ、博客、SEO 段落 B/C）：
- best location for coffee shop / restaurant / retail store
- store location analysis tool
- competitor analysis for new store
- foot traffic analyzer for retail
- site selection for small business
- free store location analysis tool
内容策略：
- 首页承载主关键词 + 转化 CTA
- /map 页面 title：Site Analysis Map | Store Location Analyzer
- 博客（Phase 2）：2026 Best Locations for [垂直] Stores in [City]，文末 CTA → /map
- 工具：Google Keyword Planner / Ahrefs 验证搜索量

---
5. 数据流（MVP）
flowchart LR
  HomePage[Homepage_slash] -->|"CTA"| MapPage[Map_Workspace]
  MapPage --> Search[Places_Autocomplete]
  Search --> Geocode[Geocoding]
  Geocode --> PlacesAPI[Places_Nearby]
  PlacesAPI --> Score[Rule_Based_Score]
  Score --> Cards[Kanban_Cards]
  Cards --> MapMarkers[Map_Markers]
  Cards --> Report[PDF_Export]

---
6. 开发优先级（建议顺序）
1. /map 布局：全屏地图 + 左侧浮层面板骨架（对齐截图）
2. 搜索 + 单点分析 + 卡片列表（mock 分数亦可）
3. / 首页：Hero、SEO 段落、Testimonials、CTA → /map
4. 报告导出（最简 HTML/PDF）
5. Freemium 额度（Supabase + 登录，可后置）
6. Phase 2：多地点对比、行业 filter、博客 SEO

---
7. 获客与风控（Indie Hacker）
- 垂直切入：coffee shop / retail / small service 三类先做深
- 获客：Product Hunt、Indie Hackers、Reddit（r/smallbusiness、r/Entrepreneur）、长尾 SEO
- 变现：Freemium → 订阅；控制 Google API 成本（缓存 Geocode、限制 Free 次数）
- 不做：专有 foot traffic 数据订阅、重型 GIS、企业工作流（留给 Placer.ai / Buxton）
