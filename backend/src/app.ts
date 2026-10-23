import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource, seedCategoryTypes } from './db';
import routes from './routes';
import { transactionService } from './modules/transactions/service';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  await AppDataSource.initialize();
  await seedCategoryTypes();
  await transactionService.generateDueOccurrences();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.listen(PORT, () => {
    console.log(`MWU backend running on port ${PORT}`);
  });

  // Keep recurring schedules moving while the desktop app's local backend is open.
  setInterval(() => {
    transactionService.generateDueOccurrences().catch((error) => {
      console.error('Failed to generate due recurring transactions', error);
    });
  }, 60_000);
}

start().catch((err) => {
  console.error('Failed to start app', err);
  process.exit(1);
});
