const express = require('express');
const axios = require('axios');

const app = express();
const port = 4000;

app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    next();
});

app.get('/', async (req, res) => {
  try {
    // Получаем значение параметра "source" из запроса
    const sourceParam = req.query.source;

    // Декодируем значение параметра "source"
    const decodedValue = Buffer.from(sourceParam, 'base64').toString('utf-8');

    // Делаем GET-запрос на полученный URL
    const response = await axios.get(decodedValue, { responseType: 'arraybuffer' });

    // Определяем тип контента на основе заголовков ответа
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // Отправляем данные в ответе
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
