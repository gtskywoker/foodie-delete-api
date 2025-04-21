// lib/server.js (หรือ path จริงของคุณ)
// ——————————————————————————————————————————————

require('dotenv').config();

const express    = require('express');
const cloudinary = require('cloudinary').v2;
const cors       = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// บังคับ TLS1.2 (ถ้าอยากชัวร์ก็ใส่ไว้เลย)
// require('https').globalAgent.options.secureProtocol = 'TLSv1_2_method';

// 1. สุขภาพ API เบสิค
app.get('/ping', (req, res) => {
  res.send('pong');
});

// 2. ลบรูป
app.post('/delete-image', async (req, res) => {
  // รองรับ publicId หรือ public_id
  const publicId = req.body.publicId || req.body.public_id;

  if (!publicId) {
    return res.status(400).json({ error: 'publicId (or public_id) is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Cloudinary destroy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
