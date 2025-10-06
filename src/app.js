// setting up express server
import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import routes from './routes/auth.routes.js'
import securityMiddleware from './middleware/secuirity.middleware.js'
const app = express();

app.use(helmet());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded( {extended: true}));
app.use(cookieParser())

app.use(morgan('combined',{ stream: {write: (message) => logger.info(message.trim())}}))
app.use(securityMiddleware)

app.get('/', (req, res) => {
  logger.info('Hello from Acquire API!');
  res.status(200).send('Hello CI!');
});

app.get('/health', (req, res)=> {
  res.status(200).json({status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime()})
})

app.get('/api',(res, req)=>{
  res.status(200).json({message: 'Acquire API is Running!'})
})

app.use('/api/auth', routes)

export default app;
