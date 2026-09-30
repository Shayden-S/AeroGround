import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AeroGround GSE Telemetry & Operations API',
    version: 'v4.18.2-SIN',
    timestamp: new Date().toISOString()
  });
});

// Future MERN endpoints placeholder
app.get('/api/equipment', (req, res) => {
  res.json({
    message: 'MERN backend endpoint ready for MongoDB connection',
    count: 48,
    data: []
  });
});

app.listen(PORT, () => {
  console.log(`[AeroGround Server] Listening on port ${PORT}`);
});
