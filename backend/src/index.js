const express = require('express');
require('dotenv').config();

const creditsRouter = require('./routes/credits');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API Routes
app.use('/api/credits', creditsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`CarbonX backend server is running on port ${PORT}`);
});
