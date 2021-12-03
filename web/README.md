Для запуска необходимо установить LTS версию Node.js - https://nodejs.org/en/.

# Запуск frontend

```bash
cd client
npm run start
```

client/src/api/trash.api.js - нужно указать базовый url api

```javascript
const baseAxios = axios.create({
  baseURL: 'https://hackaton-trash-app.herokuapp.com/api',
});
```

<hr/>

# Запуск backend

Задать порт в main.js или .env

```javascript
const PORT = process.env.PORT || 3001;
```

Задать конфиг бд Mongo в db/config.js

```javascript
export const mongoDbConfig = {
  connectionString: `mongodb+srv://hackaton:trash@hackaton-cluster.v1c7f.mongodb.net/hack_db?retryWrites=true&w=majority`,
};
```

Для работы необходима MongoDB, развернуть можно, например, с помощью Docker или облачную версию Mongo.
По стандарту конфиг задан для существующей бесплатной базы в облаке, макс. объем - 512мб.

Запуск сервера

```bash
node main.js
```
