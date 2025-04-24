require('dotenv').config();

const express     = require('express');
const cloudinary  = require('cloudinary').v2;
const cors        = require('cors');

// ✅ ตั้งค่า Cloudinary จาก Environment
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:     process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors());
app.use(express.json()); // ช่วยให้ Express รู้จักการ parse JSON จาก body

// 1. สุขภาพ API เบสิค
app.get('/ping', (req, res) => {
    res.send('pong');
});

// 2. ลบรูป
app.post('/delete-image', async (req, res) => {
    const requestStartTime = Date.now();
    const requestTimestamp = new Date().toISOString();
    console.log(`[${requestTimestamp}] Request received for /delete-image. Body: ${JSON.stringify(req.body)}`);

    // รองรับ publicId หรือ public_id
    const publicId = req.body.publicId || req.body.public_id;

    if (!publicId) {
        const errorTimestamp = new Date().toISOString();
        console.error(`[${errorTimestamp}] Error: publicId (or public_id) is required`);
        return res.status(400).json({ error: 'publicId (or public_id) is required' });
    }

    try {
        const deleteStartTime = Date.now();
        const result = await cloudinary.uploader.destroy(publicId);
        const deleteEndTime = Date.now();
        const deleteDuration = deleteEndTime - deleteStartTime;
        const deleteTimestamp = new Date().toISOString();
        console.log(`[${deleteTimestamp}] Cloudinary destroy successful for publicId: ${publicId} in ${deleteDuration}ms. Result: ${JSON.stringify(result)}`);
        const responseTime = Date.now() - requestStartTime;
        const responseTimestamp = new Date().toISOString();
        console.log(`[${responseTimestamp}] Response sent for /delete-image in ${responseTime}ms`);
        res.status(200).json({ success: true, result });
    } catch (error) {
        const errorTimestamp = new Date().toISOString();
        console.error(`[${errorTimestamp}] Cloudinary destroy error for publicId: ${publicId}:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});