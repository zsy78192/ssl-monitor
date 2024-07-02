const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(32).toString('hex');
// console.log(jwtSecret);

// jwtSecret 写入环境变量 .env 文件
let fs = require('fs');
let path = require('path');
let envPath = path.join(__dirname, '.env');
console.log(envPath);
// 查找替换
let envContent = fs.readFileSync(envPath, 'utf8');
console.log(envContent);
let reg = /JWT_SECRET = .*/g;
let newEnvContent = envContent.replace(reg, `JWT_SECRET = ${jwtSecret}`);
// console.log(newEnvContent);
fs.writeFileSync(envPath, newEnvContent, 'utf8');


