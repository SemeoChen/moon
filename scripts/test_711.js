const http = require('http');

const postData = 'commandid=SearchStore&city=%E5%8F%B0%E5%8C%97%E5%B8%82&town=%E4%BF%A1%E7%BE%A9%E5%8D%80';

const options = {
  hostname: 'emap.pcsc.com.tw',
  port: 80,
  path: '/EMapSDK.aspx',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Response length:", data.length);
    console.log("Sample Data:", data.substring(0, 500));
  });
});

req.write(postData);
req.end();
