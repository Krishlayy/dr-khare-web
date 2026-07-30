const fs = require('fs');
const http = require('http');
const FormData = require('form-data');

(async () => {
  // Create mock files
  fs.writeFileSync('test.png', 'mock image');
  fs.writeFileSync('test.pdf', 'mock pdf');
  fs.writeFileSync('test.mp4', 'mock video');

  async function upload(filename) {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('file', fs.createReadStream(filename));
      
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/media',
        method: 'POST',
        headers: form.getHeaders()
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      form.pipe(req);
    });
  }

  console.log('Uploading Image...');
  const imgRes = await upload('test.png');
  console.log('Upload OK:', imgRes);
  
  console.log('Uploading PDF...');
  const pdfRes = await upload('test.pdf');
  console.log('Upload OK:', pdfRes);

  console.log('Uploading Video...');
  const vidRes = await upload('test.mp4');
  console.log('Upload OK:', vidRes);

  console.log('Deleting Image...');
  const req = http.request({ hostname: 'localhost', port: 5000, path: `/api/media/${imgRes._id}`, method: 'DELETE' }, res => {
    console.log('Delete status:', res.statusCode);
  });
  req.end();
})();
