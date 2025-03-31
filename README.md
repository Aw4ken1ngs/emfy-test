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
   - `Client ID`
   - `Client Secret`
   - `Redirect URI`

### 2. Установка
```bash
git clone https://github.com/Aw4ken1ngs/emfy-test.git
cd crm-dashboard
npm install
``` 

3. Настройка авторизации
Откройте файл src/api/auth.js

Замените в объекте client следующие значения:

client_id: "your_client_id",          // Ваш Client ID из amoCRM
client_secret: "your_secret",         // Ваш Client Secret
code: "your_authorization_code"       // Ваш код авторизации

4. Создание тестовых данных
   Перейдите в ваш аккаунт amoCRM

Создайте тестовые задачи в разделе "Задачи"

5. Запуск проекта
```bash
   npm run start
```
Приложение откроется в браузере по адресу http://localhost:3000

🔍 Функционал
Авторизация
OAuth 2.0 авторизация

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