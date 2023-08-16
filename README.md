# look-and-say

### 실행 환경

Node.js 가 설치된 터미널이 필요합니다.

필자가 사용한 Node.js 의 버전은 v18.16.0 입니다.

### 실행 방법

1. GitHub 저장소에 업로드된 코드를 모두 다운로드 받습니다.

2. 터미널에서 coding-interview/look-and-say 디렉토리로 이동합니다.

3. 2)의 위치에서 node 명령어를 통해 아래와 같이 test.js를 직접 실행합니다.

```bash
$> node test.js
```

# restful-api

### 실행 환경

npm에서 xlsx, mysql2, express 그리고 테스트를 위한 mocha와 chai를 설치해야 합니다.

단, mocha와 chai를 설치할 경우 -D 옵션을 활용하여 npm install을 진행해야 합니다.

DataBase는 MySQL을 사용합니다.

### 실행 방법

1. MySQL을 활용하여 127.0.0.1의 host를 갖는 food_nutrition_db 이름의 DataBase를 생성합니다.

2. createTables.sql을 사용하여 food_nutrition_db에 Table들을 생성합니다.

3. 터미널에서 restful-api/utils/xlparser.js 실행하여 엑셀 파일의 자료를 DB로 전달합니다.

```bash
$> node xlparser.js
```

4. 서버를 실행합니다.

```bash
$> node run real
```

5. 브라우저의 빈 탭에서 [http://127.0.0.1:8080/api/v1.0/nutritions](http://127.0.0.1:8080/api/v1.0/nutritions?maker_name=%EA%B1%B0%EC%A0%9C) 를 입력하여 검색 조건이 없는 초기 화면으로 요청합니다.

6. 브라우저의 주소창에 query를 이용하여 검색 인자를 다음과 같이 입력하고 데이터를 확인합니다. [http://127.0.0.1:8080/api/v1.0/nutritions?maker_name=거제](http://127.0.0.1:8080/api/v1.0/nutritions?maker_name=%EA%B1%B0%EC%A0%9C)

# 참고 자료

### Array.prototype.reduce()

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

### Map Object

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map

### Object.values()

- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/values

### express

- https://www.npmjs.com/package/express

### mocha

- https://www.npmjs.com/package/mocha

### mysql2

- https://www.npmjs.com/package/mysql2#first-query

### xlsx

- https://www.npmjs.com/package/xlsx
