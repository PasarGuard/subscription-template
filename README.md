# PasarGuard Template

A modern, responsive user dashboard template for PasarGuard with multi-language support (English, Persian, Chinese, Russian).

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="English UI" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="Persian UI" width="30%">
</p>

Built with React + TypeScript + Vite, featuring real-time data updates, QR code generation, and beautiful UI components.

## ✨ Features

- 🌍 Multi-language support (EN, FA, ZH, RU) - users can change language in the UI
- 📱 Fully responsive design
- 🎨 Modern UI with dark mode support
- 🔄 Real-time data updates (10s interval)
- 📊 Traffic usage charts
- 🔗 QR code generation for connection links
- 📋 One-click copy to clipboard
- ⚡ Fast and lightweight

---

## 📦 Installation

**1. Download the template**

Each release includes language-prefixed fallback versions. The default version uses Persian (fa) as the fallback language. Users can change their language in the UI, but you can set a different fallback:

```sh
# Download default version (Persian fallback)
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html

# Or download a specific fallback language (en, fa, zh, ru)
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/en.html
```

**2. Configure PasarGuard**

```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

Or manually edit `/opt/pasarguard/.env` and uncomment:
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**3. Restart PasarGuard**

```sh
pasarguard restart
```

---

## 📖 Other Languages

- [فارسی (Persian)](README.fa.md)
- [中文 (Chinese)](README.zh.md)
- [Русский (Russian)](README.ru.md)
