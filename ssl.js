const tls = require('tls');

// 封装成 Promise

function getSSLCertificateExpirationDate(hostname, port = 443) {
    return new Promise((resolve, reject) => {
        const options = {
            host: hostname,
            port: port,
            rejectUnauthorized: false,
            servername: hostname,
        };

        const socket = tls.connect(options, () => {
            const cert = socket.getPeerCertificate();
            console.log(cert);
            const expirationDate = new Date(cert.valid_to);

            // console.log(`SSL Certificate Expiration Date for ${hostname}:${port}: ${expirationDate}`);

            // Close the socket once you have the information
            socket.end();

            resolve({
                hostname,
                port,
                expirationDate,
            });
        });

        socket.on('error', (err) => {
            // console.error(`Error connecting to ${hostname}:${port}: ${err.message}`);
            reject(err);
        });

    });
}

module.exports = getSSLCertificateExpirationDate;