const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/convert', upload.single('mp4File'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false });
    }

    const mp4Buffer = req.file.buffer;
    const mp4Path = 'input.mp4';
    const mp3Path = 'output.mp3';

    fs.writeFileSync(mp4Path, mp4Buffer);

    ffmpeg()
        .input(mp4Path)
        .audioCodec('libmp3lame')
        .toFormat('mp3')
        .on('end', () => {
            const mp3Buffer = fs.readFileSync(mp3Path);
            res.json({ success: true, mp3Url: `data:audio/mp3;base64,${mp3Buffer.toString('base64')}` });
            fs.unlinkSync(mp4Path);
            fs.unlinkSync(mp3Path);
        })
        .on('error', (err) => {
            console.error('Error:', err);
            res.json({ success: false });
        })
        .save(mp3Path);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
