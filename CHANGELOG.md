# 更新记录

本文件用于记录 WorkCycle 网站的主要功能更新、样式调整和部署相关变更。以后每次修改代码时，都应同步补充本文件。

## 2026-05-25

### 维护规范

- 新增 `CHANGELOG.md`，用于集中记录每次更新内容。
- 后续代码变更应按时间倒序追加记录，包含：更新目的、涉及文件、部署注意事项。

### 日历格荧光标注显示修复

- 修复日历格预览只显示纯文字、不显示荧光标注的问题。
- 修改 `app.js`：日历格预览从纯文本渲染改为安全保留 `mark[data-color]` 标签。
- 修改 `styles.css`：为日历格中的黄色、绿色、蓝色、粉色荧光标注补充样式。
- 修改 `index.html`：更新资源版本号，避免浏览器或 Cloudflare 缓存旧脚本。

### 空白日期显示优化

- 修改 `app.js`：没有填写内容的日期格子保持空白。
- 移除空白日期格中原先显示的“点击填写今日工作内容”。
- 修改 `index.html`：更新资源版本号，避免继续加载旧脚本。

### 页面布局压缩优化

- 修改 `index.html`：将页面主体改为两栏布局。
- 修改 `styles.css`：压缩顶部标题、月份栏、图例和日历格高度。
- 将编辑区放到右侧，减少页面垂直滚动。
- 右侧编辑区使用 sticky 布局，方便在查看日历时保持编辑入口可见。
- 缩短荧光按钮文案为“黄 / 绿 / 蓝 / 粉 / 清除”。

### 初版功能构建

- 新建 WorkCycle 月度工作记录网站。
- 新增 `index.html`：页面结构，包括标题、月份切换、图例、月历、每日记录编辑区。
- 新增 `styles.css`：浅色风格、日历格、周期底色、汇报日标记、编辑器和荧光按钮样式。
- 新增 `app.js`：月份切换、日期选择、每日记录编辑、自动保存、荧光标注、本地存储回退。
- 新增 `functions/api/records.js`：Cloudflare Pages Functions API，用于通过 D1 保存和读取每日工作记录。
- 新增 `README.md`：部署说明、D1 绑定说明、推荐域名说明。

### 部署与配置建议

- 建议 Pages 项目名：`workcycle`。
- 建议访问域名：`log.morandi.dpdns.org` 或 `worklog.morandi.dpdns.org`。
- Cloudflare Pages 构建配置：

```text
Framework preset: None
Build command: exit 0
Build output directory: /
Root directory: 留空
```

- D1 数据库建议：

```text
Database name: workcycle-db
Binding variable name: DB
```
