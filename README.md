# amoCRM


React-приложение для просмотра и управления сделками из amoCRM с авторизацией OAuth 2.0 и интерактивным интерфейсом.

## 🛠 Технологии

- **Frontend**: React 18, CSS Modules
- **API**: amoCRM REST API
- **Авторизация**: OAuth 2.0 (токены access/refresh)
- **Состояние**: React Hooks (useState, useEffect)
- **UI**: Кастомные компоненты таблиц, индикаторы загрузки

## 📁 Структура компонентов
├── components/
│ ├── DealTable/ # Таблица сделок с детализацией
│ │ ├── DealTable.jsx
│ │ └── DealTable.module.css
│ ├── DealRow/ # Строка сделки
│ ├── DealDetails/ # Детализация сделки
│ ├── ErrorMessage/ # Компонент ошибок
│ └── LoadingIndicator/ # Индикатор загрузки
├── api/
│ ├── auth.js # Логика работы с OAuth
│ └── deals.js # Запросы к amoCRM
└── App.js # Основной компонент


## 🚀 Быстрый старт

### 1. Настройка amoCRM
1. Создайте интеграцию в [amoCRM Маркетплейс](https://www.amocrm.ru/developers)
2. Получите:
    - Client ID
    - Client Secret
    - Redirect URI

### 2. Установка
```bash
git clone https://github.com/your-repo/crm-dashboard.git
cd crm-dashboard
npm install

🔍 Функционал
Авторизация через OAuth 2.0

Автоматическое обновление токенов

Локальное хранение токенов

Работа со сделками

Постраничная загрузка

Интерактивная таблица

Детализация по клику

Визуализация

Цветовая индикация статусов задач

Анимации загрузки

Обработка ошибок

