# WorkCycle

一个适合部署到 Cloudflare Pages 的月度工作记录网站。

建议仓库名：`WorkCycle`

建议域名：`worklog.morandi.dpdns.org`

## 功能

- 以“月”为主体显示当月日历。
- 每周三显示“汇报日”标记。
- 每周四至下周三作为一个工作周期，用浅色背景分隔。
- 每一天都可以填写工作内容。
- 支持对选中的文字添加浅色荧光标注。
- 绑定 Cloudflare D1 后，记录会保存到云端；未绑定 D1 时，会自动保存到当前浏览器本地。

## Cloudflare Pages 部署参数

```text
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: 留空
```

## D1 绑定

在 Pages 项目的 Settings → Bindings 中添加 D1 database：

```text
Variable name: DB
Database name: workcycle-db
```

绑定后重新部署一次。

## 自定义域名

建议在 Pages → Custom domains 中添加：

```text
worklog.morandi.dpdns.org
```

如果 Cloudflare 没有自动创建 DNS，请添加：

```text
Type: CNAME
Name: worklog
Target: 你的 Pages 默认域名，例如 workcycle.pages.dev
Proxy status: Proxied
```
