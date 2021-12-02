import express from 'express';
import cors from 'cors';
import path from 'path';
import trashDataRouter from './routers/trash-data.router.js';
import mongoose from 'mongoose';
import { mongoDbConfig } from './db/config.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname, 'client', 'build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(cors());

app.use(express.json());

app.use('/api', trashDataRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listen ${PORT} port...`);
  mongoose
    .connect(mongoDbConfig.connectionString)
    .then(() => console.info('Succesfully connected to MongoDB'))
    .catch((err) => console.error(err));
});
