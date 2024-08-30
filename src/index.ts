// @types/express v4.x
import express, { Request, Response } from 'express';

const app = express();

app.get('/search', (req: Request, res: Response) => {
    const searchTerm = req.query.term; // no error, `req.query` is `any`
    res.send(`Search term is: ${searchTerm}`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
