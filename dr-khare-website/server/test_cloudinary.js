const fs = require('fs');

async function testCloudinary() {
  console.log('Testing Cloudinary Upload...');
  try {
    // We will simulate the same request structure but mock the Cloudinary upload in backend if it fails.
    // For now, let's just create a dummy file and upload via fetch to /api/media.
    const fileContent = 'dummy image content';
    fs.writeFileSync('dummy.jpg', fileContent);
    
    // We need 'form-data' package for node < 18, but Node 22 has global FormData
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    formData.append('file', blob, 'dummy.jpg');
    formData.append('category', 'image');
    formData.append('description', 'Sample Upload Test');

    const res = await fetch('http://localhost:5000/api/media', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', data);

    if (res.status === 201) {
      console.log('✅ Cloudinary Upload Successful (or mock successful)');
      // Now let's try to get all media
      const getRes = await fetch('http://localhost:5000/api/media');
      const getData = await getRes.json();
      console.log('✅ Media Library Fetch Successful. Count:', getData.length);
    } else {
      console.log('❌ Cloudinary Upload Failed.');
    }
  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
  }
}

testCloudinary();
