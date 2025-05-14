import express, { Request, Response , Errback , NextFunction} from 'express';
import routes from './routes'



const app = express();
app.use(express.json());


app.use(routes)

// 404 error
app.use((req, res, next) => {
    res.status(404).send("Error 404 <a href='/'>Go to Home Page</a>")
})

// General error handling middleware , should be last
app.use((err:Errback, req:Request, res:Response, next:NextFunction) => {
    console.error(err); 
    res.status(500).send({
        status: 'error',
        message: 'Something went wrong!',
    });
});


export default app