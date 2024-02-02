// 引入
const getSSLCertificateExpirationDate = require('./ssl');

// 测试
test('getSSLCertificateExpirationDate', async () => {
    let res = await getSSLCertificateExpirationDate('api2.gerinn.com');
    console.log(res);

});