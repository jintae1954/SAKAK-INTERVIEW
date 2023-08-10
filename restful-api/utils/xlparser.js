const path = require('path');
const XLSX = require('xlsx');
const db = require('./db');
const sqls = require('../sqls.json');

// argv[] 를 통한 실행 파일 검증
if (process.argv.length < 2) {
  console.log('input xlsx file, please.');
  console.log('usage) node xlparser <file-path>');
  console.log('ex) node xlparser ../data.xlsx');
  return;
}

// 엑셀 파일 입력 및 시트 설정
const inputFile = process.argv[2] || '../data/source.xlsx';
const workBook = XLSX.readFile(path.join(__dirname, inputFile));
const [sheetName] = workBook.SheetNames;
const workSheet = workBook.Sheets[sheetName];

// 엑셀 파일의 범위 검증
const [first, last] = workSheet['!ref'].split(':');
if (!first.startsWith('A') || !last.startsWith('CV')) {
  console.error(`엑셀파일 데이터 형식이 올바르지 않습니다!(${first}~${last})`);
  return;
}

// JS object로 변환된 시트를 2D Array로 반환
const data = XLSX.utils.sheet_to_json(workSheet, {
  header: 1,
  // range: 'A2:CV4', // sample data
  range: 'A2:CV7684',
});

// 테이블 정규화 및 bulk data 삽입
(async function () {
  try {
    await insertSet(data, ['D'], 'DbGroup'); // DB군
    await insertSet(data, ['E'], 'CommItem'); // 상용제품
    await insertSet(data, ['H'], 'Maker'); // 지역/제조사
    await insertSet(data, ['I'], 'CollectTime'); // 채취시기
    await insertSet(data, ['J'], 'FoodCate'); // 식품대분류
    await insertSet(data, ['J', 'K'], 'FoodSubCate'); // 식품상세분류
    await insertSet(data, ['CU'], 'Ref'); // 성분표출처
    await insertSet(data, ['CV'], 'Issue'); // 발행기관

    // insert할 데이터 가공 ('-'은 null 처리)
    for (let i = 0; i < data.length; i += 1) {
      const row = data[i];
      for (let j = 0; j < row.length; j += 1) {
        row[j] = row[j] === '-' ? null : row[j];
      }
    }

    // id 을 제외한 값을 사용하여 params 설정
    const params = data.map(row => row.slice(1));

    // 마지막으로 Master 테이블에 insert
    db.insertBulk(sqls.Nutrition.insert, params, (err, rows) => {
      if (err) {
        console.error('ERROR on db.insertBulk>>', err.message);
      }
      console.log('last-affected>>', rows);
    });
  } catch (error) {
    console.error('ERROR:', error.message);
  }
})();

// 테이블에 튜플 삽입 후 엑셀에 있는 값을 id 값으로 변경
async function insertSet(data, col, table) {
  const idxes = col.map(c => colIdx(c));
  const params = data.map(row => idxes.map(idx => row[idx]));
  const map = await db.insertSelect(table, params);
  const idx = idxes[idxes.length - 1];
  data.forEach(row => (row[idx] = map.get(row[idx])));
}

/**
 * 엑셀의 컬럼 알파벳을 Array Index로 변환
 * ex)
 *   'A' = 0
 *   'B' = 1
 *   'AA' = 27
 *   'CS' = 96
 */
function colIdx(col) {
  const firstIdx = col.charCodeAt(0) - 65;
  if (col.length === 1) return firstIdx;
  if (col.length === 2) return (firstIdx + 1) * 26 + col.charCodeAt(1) - 65;
}
