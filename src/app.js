// setting up express server
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello CI!');
});

export default app;
