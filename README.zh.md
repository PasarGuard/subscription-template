# PasarGuard 订阅模板

PasarGuard 的响应式订阅页面模板。

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="English UI" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="Persian UI" width="30%">
</p>

## 功能

- 语言：`en`、`fa`、`zh`、`ru`
- 用户可在界面中切换语言
- 响应式布局
- 深色模式
- 连接链接 QR 码
- 一键复制链接和配置，并支持 Base64 复制
- WireGuard 链接可复制为原生配置，也可下载为 `.conf`
- [颜色自定义](#color-customization)

## 快速安装（推荐）

运行安装脚本（选择默认语言）：

```sh
curl -fsSL https://raw.githubusercontent.com/PasarGuard/subscription-template/main/install.sh | sudo bash -s -- --lang zh
```

`--lang` 支持：`en`、`fa`、`zh`、`ru`

## 手动安装

1. 下载模板：

```sh
sudo mkdir -p /var/lib/pasarguard/templates/subscription
sudo wget -O /var/lib/pasarguard/templates/subscription/index.html \
https://github.com/PasarGuard/subscription-template/releases/latest/download/zh.html
```

2. 在 `/opt/pasarguard/.env` 中配置 PasarGuard：

```dotenv
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

3. 重启：

```sh
pasarguard restart
```

## 从源码构建

```sh
git clone https://github.com/PasarGuard/subscription-template.git
cd subscription-template
bun install
bun run build
```

使用生成的文件：

```sh
sudo cp dist/index.html /var/lib/pasarguard/templates/subscription/index.html
```

<a id="color-customization"></a>

## 颜色自定义

在 `.env` 中设置下面的值，然后重新构建：

```dotenv
VITE_PRIMARY_COLOR_LIGHT=oklch(0.48 0.11 250)
VITE_PRIMARY_COLOR_DARK=oklch(0.60 0.12 250)
```

## 其他语言

- [English](README.md)
- [فارسی (Persian)](README.fa.md)
- [Русский (Russian)](README.ru.md)
