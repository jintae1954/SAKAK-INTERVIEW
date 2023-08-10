const express = require('express');
const app = express();

const db = require('./utils/db');

app.get('/api/v1.0/nutritions', async (req, res) => {
  const { food_name, research_year, maker_name, food_code } = req.query;
  if (!food_name && !research_year && !maker_name && !food_code) {
    res
      .status(400)
      .send({ message: '검색할 조건을 입력하세요!', code: 'BadRequest' });
    return;
  }

  try {
    const data = await db.findNutritions(req.query);
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message, code: 'QueryException' });
  }
});

app.listen(8080, () => console.log('Server started at 8080...'));
