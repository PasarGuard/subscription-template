# PasarGuard 模板

适用于 PasarGuard 的现代化响应式用户仪表板模板，支持多语言（英语、波斯语、中文、俄语）。

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="英文界面" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="波斯语界面" width="30%">
</p>

使用 React + TypeScript + Vite 构建，具有实时数据更新、QR 码生成和美观的 UI 组件。

## ✨ 功能

- 🌍 多语言支持（EN, FA, ZH, RU）- 用户可在界面中更改语言
- 📱 完全响应式设计
- 🎨 支持深色模式的现代 UI
- 🔄 实时数据更新（10 秒间隔）
- 📊 流量使用图表
- 🔗 连接链接的 QR 码生成
- 📋 一键复制到剪贴板
- ⚡ 快速轻量

---

## 📦 安装

**1. 下载模板**

每个版本都包含带语言前缀的默认版本。默认版本使用波斯语（fa）作为默认语言。用户可以在界面中更改语言，但您可以设置不同的默认语言：

```sh
# 下载默认版本（波斯语默认）
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html

# 或下载特定默认语言（en, fa, zh, ru）
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/zh.html
```

**2. 配置 PasarGuard**

```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

或手动编辑 `/opt/pasarguard/.env` 并取消注释：
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**3. 重启 PasarGuard**

```sh
pasarguard restart
```

