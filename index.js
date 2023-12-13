// index.js
const { createConnection } = require('typeorm');
const typeorm = require('typeorm');
const EntitySchema = typeorm.EntitySchema;
const gspSchema = require('./GovernmentSupportProjectSchema')

async function connectToDatabase() {
  try {
    // 데이터베이스 연결 생성
    const connection = await createConnection({
      // 연결 설정
        type: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: true,
        entities: [
            gspSchema
        ]
    });

    // 데이터 삽입
    // await insertData();

    // 연결 종료
    return connection
  } catch (error) {
    console.error('오류 발생:', error);
    throw error;
  }
}

module.exports = {
    connectToDatabase
}