import db from './src/config/db.js'
import express from 'express';
import cors from 'cors';

import userRouter from './src/routers/UserRouter.js';

const app = express();

db.connect().then(() => {
    console.log('connected');
});

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));