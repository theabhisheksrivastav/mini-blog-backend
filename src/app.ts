import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postsRouter from './routes/posts.routes';
import authRouter from './routes/auth.routes';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());      

app.use(postsRouter);          
app.use('/admin', authRouter);


app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});
export default app;
