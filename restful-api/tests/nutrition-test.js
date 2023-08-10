const chai = require('chai');
const { expect } = require('chai');
const should = chai.should();

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const db = require('../utils/db.js');

const SAMPLE_NUTRITION = {
  id: 6787,
  food_cd: 'D018027',
  group_name: '구이류-육류구이',
  food_name: '돼지불고기',
  research_year: '2020',
  maker_name: '전국(대표)',
  ref_name: '식품영양성분 자료집',
  serving_size: 200,
  calorie: '449.57',
  carbohydrate: '8.1',
  protein: '29.71',
  province: '33.15',
  sugars: '9.26',
  salt: '625.15',
  cholesterol: '85.66',
  saturated_fatty_acids: '9.02',
  trans_fat: '0.2',
};

describe('db utils', () => {
  it('db-info', () => {
    const dbinfo = db.getDbInfo();
    expect(dbinfo).to.deep.equal({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'food_nutrition_db',
      waitForConnections: true,
      connectionLimit: 2,
      maxIdle: 2,
    });
  });
  it('food_code', done => {
    const mockRequest = { food_code: 'D018027' };
    chai
      .request('http://127.0.0.1:8080')
      .get('/api/v1.0/nutritions')
      .query(mockRequest)
      .end((err, res) => {
        should.not.exist(err);
        res.statusCode.should.be.eq(200);
        res.body.should.be.deep.eq([SAMPLE_NUTRITION]);
        done();
      });
  });
});
