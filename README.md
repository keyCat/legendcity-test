# LegendCity Test Application

## Задание

```
Необходимо сделать JSON REST API сервер.
Сервер хранит задачи, каждая задача имеет Название и Приоритет. Задачи можно добавлять, удалять и просматривать одну задачу с наивысшим приоритетом. Задча содержит название - строка до 255 символов и приоритет - цифры от 0 до 100.

Условие выполнения задания:
От вас требуются (ссылка на git репозитории): файлы проекта, docker-compose файл и postman файл .
Мы запускаем npm test, убеждаемся что тесты проходят.
Запускаем docker-compose, поднимается база и сервер.
Запускаем postman и пробуем добавлять, удалять и просматривать задачи.

Необходимый набор инструментов:
Node.js, Typescript, docker, jest, ajv, express, postgresql, AlaSQL для тестов, postman.
```

## Команды

- `docker-compose up` — поднять production версию приложения, в виде образа Docker;
- `npm run build` - транспилировать TypeScript в JS код;
- `npm run start` - запустить production версию приложения локально (требует `npm run build`);
- `npm run start:dev` - запустить версию приложения для разработки, используя Nodemon;
- `npm run test` - исполнить тесты;
- `npm run test:watch` - смотреть за изменениями файлов и выполнять тесты после каждого изменения;
- `npm run migrate` - запустить Sequelize миграции.

## Структура приложения

Исходный код приложения разделён на модули следующим образом:

```
docs/
└── postman_collection.json
env/                            - Переменные среды
├── development.env
├── production.env
└── test.env
migrations/                     - Миграции для Sequelize-CLI
src/                            - Исходный код
├── api/                        - Файлы, относящиеся к API
│   └── v1/
│       └── task/               - Подмодуль Task
│           ├── controllers/    - Контроллеры подмодуля Task
│           └── schema/         - Схемы валидации подумодуля Task
├── core/                       - Общие файлы приложения
│   └── exceptions/             - Классы исключений
├── database/                   = Модуль базы данных
│   ├── models/                 = Модели Sequelize
│   └── services/               - Сервисы базы данных
│       ├── __mocks__/          - Моки Jest
├── decorators/                 - TS-декораторы
│   ├── jsonschema/             - TS-декораторы для JSONSchema
└── index.ts                    - Основной файл для запуска приложения
util/                           - Вспомогательные скрипты
```

## Комментарии разработчика

Несмотря на то, что задание является довольно тривиальным и может быть исполнено менее, чем за один день,
я решил пойти дальше и создал мини-фреймворк на основе Express.
Обычно, я бы использовал Ts.ED или NestJS, вместо изобретения велосипеда, но тесты даются не для того, чтобы показать умение пользованием NPM ;)

Подобная структура и имплементация присуща production-grade приложениям и, несмотря на определённый оверхэд, позволяет начать быстро добавлять новый функционал без копипаста и
дупликации кода, вроде регистрации роутеров, добавления валидации, etc. Так же, код остаётся разделённым для лёгкого тестирования.

### Возникшие проблемы

Основная проблема: AlaSQL. Помимо странных ошибок, возникших во время разработки и неполной типизации библиотеки, я вижу концептуальную проблему использования AlaSQL.

Во время разработки, я не нашёл полезным использовать другой драйвер для БД, с учётом того ни один query builder или ORM не поддерживают AlaSQL.

Такой подход, возможно, окупается, когда пишутся простейшие SQL запросы под каждую функцию, но в условиях реальной разработки я нахожу такой подход помехой,нежели плюсом.

В серьёзных проектах часто используются процедуры, рекурсивные запросы и виды (материализованные или нет).
И в этом плане, по моему мнению, AlaSQL быстро перестаёт быть хорошим инструментов для тестирования приложения, использующего PostgreSQL.

/ личное_мнение
