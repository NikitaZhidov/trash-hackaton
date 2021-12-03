import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import trashDataRouter from './routers/trash-data.router.js';
import mongoose from 'mongoose';
import { mongoDbConfig } from './db/config.js';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    if (req.url !== '/map') {
      return res.redirect('/map');
    } else {
      return res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    }
  });
}
