# Portainer CE 简体中文版本

本仓库的 `main` 分支基于官方 Portainer CE `2.45.3`，加入简体中文语言包和语言切换入口。后端继续直接使用官方 Portainer CE 镜像，仅替换由本仓库源码构建的前端 `/public` 资源。

## 镜像

推送到 `main` 后，GitHub Actions 会自动构建并发布以下多架构镜像：

```text
ghcr.io/zzw6776/portainer-ce-zh:2.45.3
ghcr.io/zzw6776/portainer-ce-zh:latest
```

## 运行

```bash
docker run -d \
  --name portainer \
  --restart=always \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  ghcr.io/zzw6776/portainer-ce-zh:2.45.3
```

已有官方 Portainer 容器升级到此镜像时，继续挂载原来的 `/data` 数据卷即可。切换镜像前仍应备份该数据卷。

## 更新上游版本

升级 Portainer 时需要同时更新以下内容，并在本地构建验证后直接提交到 `main`：

1. 将源码基线更新到目标官方稳定标签。
2. 更新 `Dockerfile.zh-CN` 中的官方镜像版本和镜像摘要。
3. 补齐 `translations/zh-CN/translation.json` 中新增或变化的文案。
4. 运行 `pnpm install --frozen-lockfile`、`NODE_ENV=production pnpm build --config webpack/webpack.production.js` 和 `pnpm typecheck`。

本仓库不维护额外汉化分支。
