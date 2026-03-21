const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {bundle} = require('@remotion/bundler');
const {getCompositions, renderMedia} = require('@remotion/renderer');
const ffmpegPath = require('ffmpeg-static');

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

app.post('/api/render', async (req, res) => {
  try {
    const { compositionId, props } = req.body || {};
    const compId = compositionId || 'wedding-video';
    const entry = path.join(__dirname, 'remotion-entry.jsx');
    const serveUrl = await bundle(entry);
    const comps = await getCompositions(serveUrl, {inputProps: props || {}});
    const comp = comps.find((c) => c.id === compId);
    if (!comp) {
      return res.status(500).json({error: 'composition not found'});
    }
    const outPath = path.join(__dirname, `out-${Date.now()}.mp4`);
    await renderMedia({
      composition: comp,
      serveUrl,
      codec: 'h264',
      audioCodec: 'aac',
      outputLocation: outPath,
      inputProps: props || {},
      ffmpegExecutable: ffmpegPath,
      chromiumOptions: {gl: 'angle'},
    });
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="wedding-${Date.now()}.mp4"`);
    const stream = fs.createReadStream(outPath);
    stream.pipe(res);
    stream.on('close', () => {
      fs.unlink(outPath, () => {});
    });
  } catch (e) {
    res.status(500).json({error: String(e && e.message ? e.message : e)});
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Render server listening on', port);
});
