# Slidev 演示工作台

这是个人主页之外的独立演示源码目录。Hugo 仍负责原有主页；Slidev 只生成 `/slides/` 下的页面。

## 快速开始

需要 Node.js 22.12+，推荐 Node.js 24（见 `.nvmrc`）。在本目录执行：

```bash
npm ci
npm run dev
```

打开 http://localhost:3030 ，编辑 `decks/demo/slides.md`，保存后自动刷新。

## 新建一份演示

```bash
npm run new -- my-talk "我的演示"
npx slidev decks/my-talk/slides.md --port 3030
```

新演示会写入 `decks.json`，默认 `publish: false`。检查内容可以公开后，将该项设为 `true`，再提交源码和清单。

**注意：本 GitHub 仓库是公开的，提交的源码、图片、注释和演讲者备注也会公开。** `publish: false` 只表示不生成网站入口，不会让仓库里的文件变成私密。私密材料不要提交；`.env`、凭证和私人研究资料也不要放入演示。公开网页构建使用 `--without-notes`，但它不能隐藏已提交的源文件。

## 构建与本地成品预览

```bash
npm test
npm run build
npm run preview
```

打开 http://127.0.0.1:4173/slides/ 。构建结果保存在 `dist/slides/`，每个演示在 `dist/slides/<slug>/`。

- 目录：`https://windrise.github.io/slides/`
- 示例：`https://windrise.github.io/slides/demo/`
- 直接分享某一页：`https://windrise.github.io/slides/demo/#/3`

上述公开链接在改动合并到 `main` 且 Pages 工作流成功后生效。所有演示保留 `routerMode: hash`，这样刷新和直接打开页面不需要服务器回退规则。

## 发布流程与主页保护

1. 提交 `slides/` 源码和 `package-lock.json`，先运行检查并审阅 PR
2. 合并到 `main` 后，原有 `.github/workflows/hugo.yml` 先构建整个 Hugo 主页
3. 工作流再构建 Slidev，并把成品添加到 `public/slides/`
4. 原有 Pages 工作流统一发布整个 `public/`，不建立第二个会覆盖主页的 Pages 部署

构建脚本只清理本目录的 `dist/`。部署步骤发现已有 `public/slides` 时会失败，避免悄悄覆盖其他内容。不修改主页内容、个人信息或导航。

## 多份演示的目录结构

```text
slides/
  decks.json                 # 标题、简介、URL slug、是否构建发布
  decks/<slug>/slides.md     # 每份演示的 Markdown
  templates/slides.md        # 新演示模板
  scripts/                   # 构建、目录页、预览与测试
  package.json
  package-lock.json          # 固定可复现的依赖
```

可在各个 deck 目录中放置该演示自己的组件、布局和图片。安装或升级依赖时同时提交 lockfile；CI 使用 `npm ci`。本地预览进程需要运行中的电脑，不应当作长期公共托管。

## 可选导出

```bash
# 首次需要 Playwright Chromium（浏览器安装到本机）
npx playwright install chromium
npm run export -- --output demo.pdf
```

导出依赖浏览器，独立于网页构建。其他演示可以使用 `npx slidev export decks/my-talk/slides.md`。

参考：[Slidev 文档](https://sli.dev/guide/) · [构建与子路径](https://sli.dev/guide/hosting)

## 浏览器回归检查（可选）

在仓库根目录执行 `npm ci` 和 `npx playwright install chromium` 后，运行：

```bash
node slides/scripts/smoke.mjs
```

它会临时启动静态预览，检查清单内各公开演示的页码直达、刷新、键盘返回和移动端目录布局。设置 `SLIDES_SCREENSHOTS=/tmp/slides-shots` 可保存截图；CI 的 Slidev checks 会执行此检查。浏览器测试需要允许运行 Chromium 的环境。
