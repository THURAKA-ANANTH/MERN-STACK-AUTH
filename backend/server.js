import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import { notFound,errorHandler } from "./middlewaare/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from './routes/userRoutes.js'

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/users',userRoutes);
app.get('/',(req,res)=>res.send('Server is Ready'));
app.use(notFound);
app.use(errorHandler);

app.listen(port,()=> console.log(`Server stared on port ${port}`));