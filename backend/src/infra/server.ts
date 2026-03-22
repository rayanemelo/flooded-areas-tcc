import 'dotenv/config';
import express, { Express } from 'express';
import { Routes } from './routes';
import morgan from 'morgan';
import cors from 'cors';

export class Server {
  private readonly app: Express;
  private readonly routes = new Routes();

  constructor() {
    this.app = express();
    this.initialize();
  }

  private initialize() {
    this.app.use(morgan('dev'));
    this.app.use(
      express.json({
        limit: '100mb',
      })
    );
    this.app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }))
    this.app.use(express.urlencoded({ extended: true }));
    this.app.get('/health', (_, res) => {
      res.status(200).json({ status: 'ok' });
    });
    this.app.use('/api', this.routes.initializeRoutes());
    this.app.get('/', (_, res) => {
      res.status(200).json({ status: 'ok' });
    });
  }

  start({ port = process.env.PORT || 3331 } = {}) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
