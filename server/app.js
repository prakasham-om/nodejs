import express from 'express'

import cors from 'cors'

import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'

let app = express();

//app.use(cors())
app.use(express.json())
app.use("/",userRouter);
app.use("/products",productRouter);

 

export default app