const my = require('mysql2');
const mysql = require('mysql2/promise');
const sqls = require('../sqls.json');

const DB_INFO = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'food_nutrition_db',
  waitForConnections: true,
  connectionLimit: 2,
  maxIdle: 2,
};

module.exports = {
  getDbInfo() {
    return DB_INFO;
  },

  // Promise 사용을 위한 db connection
  async getConn() {
    return mysql.createConnection(DB_INFO);
  },

  // Promise 미사용을 위한 db connection
  getConnection() {
    return my.createConnection(DB_INFO);
  },

  async execute(sql, params) {
    let conn;
    try {
      conn = await this.getConn();
      const data = await conn.execute(sql, params);
      conn.end();
      return data;
    } catch (error) {
      console.log('Error on db.execute>>', error.message);
      console.error('SQL>>', sql, params);
      throw error;
    }
  },

  insertBulk(sql, params, fn) {
    this.getConnection().query(sql, [params], fn);
  },

  insertSelect(table, params) {
    const {
      insert = `insert ignore into ${table}(name) values ?`,
      selectMap = `select name, id from ${table}`,
    } = sqls[table] || {};
    return new Promise((resolve, reject) => {
      this.insertBulk(insert, params, (err, rows) => {
        if (err) {
          console.error('Error.insert>>', err.message);
          reject(err);
        }

        this.getConnection().query(selectMap, (err, rows) => {
          if (err) {
            console.error('Error.select>>', err.message);
            reject(err);
          }

          // console.log('🚀 ~ this.getConnection ~ rows:', rows);
          const map = new Map(rows.map(row => Object.values(row)));
          resolve(map);
        });
      });
    });
  },

  async findNutritions({ food_name, research_year, maker_name, food_code }) {
    const filters = [];
    const params = [];
    if (food_code) {
      filters.push(`n.food_cd = ?`);
      params.push(food_code);
    }

    if (research_year) {
      filters.push(`n.research_year = ?`);
      params.push(research_year);
    }

    if (food_name) {
      filters.push(`n.food_name like concat('%', ?, '%')`);
      params.push(food_name);
    }

    if (maker_name) {
      filters.push(`m.name like concat('%', ?, '%')`);
      params.push(maker_name);
    }

    const where = filters.join(' and ');

    const [data] = await this.execute(
      `${sqls.Nutrition.find} where ${where}`,
      params
    );

    return data;
  },
};
