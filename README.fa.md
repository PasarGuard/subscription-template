# قالب اشتراک PasarGuard

قالب صفحه اشتراک واکنش‌گرا برای PasarGuard.

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="English UI" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="Persian UI" width="30%">
</p>

## امکانات

- زبان‌ها: `en`، `fa`، `zh`، `ru`
- امکان تغییر زبان توسط کاربر
- طراحی واکنش‌گرا
- حالت تاریک
- QR برای لینک‌های اتصال
- کپی با یک کلیک

## نصب سریع (پیشنهادی)

اجرای اسکریپت نصب (با انتخاب زبان پیش‌فرض):

```sh
curl -fsSL https://raw.githubusercontent.com/PasarGuard/subscription-template/main/install.sh | sudo bash -s -- --lang fa
```

مقادیر معتبر `--lang`: `en`، `fa`، `zh`، `ru`

## نصب دستی

1. دانلود قالب:

```sh
sudo mkdir -p /var/lib/pasarguard/templates/subscription
sudo wget -O /var/lib/pasarguard/templates/subscription/index.html \
https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html
```

2. تنظیم PasarGuard در فایل `/opt/pasarguard/.env`:

```dotenv
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

3. راه‌اندازی مجدد:

```sh
pasarguard restart
```

## زبان‌های دیگر

- [English](README.md)
- [Русский (Russian)](README.ru.md)
- [中文 (Chinese)](README.zh.md)
