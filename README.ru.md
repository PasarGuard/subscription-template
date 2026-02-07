# Шаблон подписки PasarGuard

Адаптивный шаблон страницы подписки для PasarGuard.

<p align="center">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/en.png" alt="English UI" width="40%">
  <img src="https://raw.githubusercontent.com/PasarGuard/subscription-template/refs/heads/main/screenshots/fa.png" alt="Persian UI" width="30%">
</p>

## Возможности

- Языки: `en`, `fa`, `zh`, `ru`
- Пользователь может менять язык в интерфейсе
- Адаптивная верстка
- Темный режим
- QR-код для ссылок подключения
- Копирование в один клик

## Быстрый старт (рекомендуется)

Запустите скрипт установки (выберите язык по умолчанию):

```sh
curl -fsSL https://raw.githubusercontent.com/PasarGuard/subscription-template/main/install.sh | sudo bash -s -- --lang ru
```

Поддерживаемые значения `--lang`: `en`, `fa`, `zh`, `ru`

## Установка вручную

1. Скачайте шаблон:

```sh
sudo mkdir -p /var/lib/pasarguard/templates/subscription
sudo wget -O /var/lib/pasarguard/templates/subscription/index.html \
https://github.com/PasarGuard/subscription-template/releases/latest/download/ru.html
```

2. Настройте PasarGuard в `/opt/pasarguard/.env`:

```dotenv
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/pasarguard/templates/"
SUBSCRIPTION_PAGE_TEMPLATE="subscription/index.html"
```

3. Перезапустите:

```sh
pasarguard restart
```

## Другие языки

- [English](README.md)
- [فارسی (Persian)](README.fa.md)
- [中文 (Chinese)](README.zh.md)
