# قالب پاسارگارد

قالب داشبورد کاربری مدرن و واکنش‌گرا برای پاسارگارد با پشتیبانی چندزبانه (انگلیسی، فارسی، چینی، روسی).

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="رابط کاربری انگلیسی" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="رابط کاربری فارسی" width="30%">
</p>

ساخته شده با React + TypeScript + Vite، با ویژگی‌های به‌روزرسانی داده‌های بلادرنگ، تولید کد QR و کامپوننت‌های رابط کاربری زیبا.

## ✨ ویژگی‌ها

- 🌍 پشتیبانی چندزبانه (EN, FA, ZH, RU) - کاربران می‌توانند زبان را در رابط کاربری تغییر دهند
- 📱 طراحی کاملاً واکنش‌گرا
- 🎨 رابط کاربری مدرن با پشتیبانی از حالت تاریک
- 🔄 به‌روزرسانی داده‌های بلادرنگ (فاصله ۱۰ ثانیه)
- 📊 نمودارهای استفاده از ترافیک
- 🔗 تولید کد QR برای لینک‌های اتصال
- 📋 کپی یک‌کلیکی به کلیپ‌بورد
- ⚡ سریع و سبک

---

## 📦 نصب

**۱. دانلود قالب**

هر نسخه شامل نسخه‌های پیش‌فرض با پیشوند زبان است. نسخه پیش‌فرض از فارسی به عنوان زبان پیش‌فرض استفاده می‌کند. کاربران می‌توانند زبان را در رابط کاربری تغییر دهند، اما می‌توانید یک پیش‌فرض دیگر تنظیم کنید:

```sh
# دانلود نسخه پیش‌فرض (پیش‌فرض فارسی)
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/index.html

# یا دانلود یک زبان پیش‌فرض خاص (en, fa, zh, ru)
sudo wget -N -O /var/lib/pasarguard/templates/subscription/index.html https://github.com/PasarGuard/subscription-template/releases/latest/download/en.html
```

**۲. پیکربندی پاسارگارد**

```sh
echo 'CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"' | sudo tee -a /opt/pasarguard/.env
echo 'SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"' | sudo tee -a /opt/pasarguard/.env
```

یا به صورت دستی فایل `/opt/pasarguard/.env` را ویرایش کرده و از حالت کامنت خارج کنید:
```
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

**۳. راه‌اندازی مجدد پاسارگارد**

```sh
pasarguard restart
```

