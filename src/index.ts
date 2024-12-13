import express from 'express';
import app from './app';
import routes from './routes/import.route'

const PORT = 3005;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/health_check_api', (req, res) => {
  const healthCheck = {
    uptime: `${Math.floor(process.uptime())} seconds`,
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.status(200).send(healthCheck);
  } catch (error) {
    healthCheck.message = error as string;
    res.status(503).send('Service Unavailable');
  }
});

app.use('/v1',routes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


