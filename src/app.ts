import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import bodyParser from 'body-parser';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

//parsers
app.use(bodyParser.json());
app.use(express.json());

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Meeting Room Booking System for Co-working spaces 🚀');
});

//global error handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
