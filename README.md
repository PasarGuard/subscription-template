# PasarGuard Template

A modern, responsive user dashboard template for PasarGuard with multi-language support (English, Persian, Chinese, Russian).

Built with React + TypeScript + Vite, featuring real-time data updates, QR code generation, and beautiful UI components.

---

## 📦 Installation

### For PasarGuard

**1. Download the template**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/releases/latest/download/index.html
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

### پاسارگارد

**۱. دانلود قالب**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/releases/latest/download/index.html
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

### PasarGuard

**1. 下载模板**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/releases/latest/download/index.html
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

### PasarGuard

**1. Загрузите шаблон**
```sh
sudo wget -N -P /var/lib/pasarguard/templates/subscription/ https://github.com/PasarGuard/releases/latest/download/index.html
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

---

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

## 🛠️ Development

This template uses React + TypeScript + Vite with HMR and ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
