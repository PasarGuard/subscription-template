# PasarGuard Template

A modern, responsive user dashboard template for PasarGuard with multi-language support (English, Persian, Chinese, Russian).

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="English UI" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="Persian UI" width="30%">
</p>


Built with React + TypeScript + Vite, featuring real-time data updates, QR code generation, and beautiful UI components.

## ✨ Features

- 🌍 Multi-language support (EN, FA, ZH, RU)
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
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html
```

**2. Configure PasarGuard**

Run the following commands in your server terminal:
```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

Or manually edit the `.env` file in `/opt/pasarguard` directory and uncomment (remove `#`) these lines:
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**3. Restart PasarGuard**
```sh
pasarguard restart
```

---

## مراحل نصب

**۱. دانلود قالب**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html
```

**۲. پیکربندی پاسارگارد**

دستورات زیر را در ترمینال سرور اجرا کنید:
```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

یا به صورت دستی فایل `.env` در پوشه `/opt/pasarguard` را ویرایش کرده و با پاک کردن `#` ابتدای خطوط زیر، آنها را از حالت کامنت خارج کنید:
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**۳. راه‌اندازی مجدد پاسارگارد**
```sh
pasarguard restart
```

---

## 安装步骤

**1. 下载模板**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html
```

**2. 配置 PasarGuard**

在服务器终端运行以下命令：
```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

或手动编辑 `/opt/pasarguard` 目录中的 `.env` 文件，取消注释（删除 `#`）以下行：
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**3. 重启 PasarGuard**
```sh
pasarguard restart
```

---

## Установка

**1. Загрузите шаблон**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html
```

**2. Настройте PasarGuard**

Выполните следующие команды в терминале сервера:
```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

Или вручную отредактируйте файл `.env` в каталоге `/opt/pasarguard`, раскомментировав (удалив `#`) следующие строки:
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**3. Перезапустите PasarGuard**
```sh
pasarguard restart
```
