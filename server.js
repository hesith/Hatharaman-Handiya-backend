import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import storyRouter from './routes/storyRoute.js'; 
import { VerifyGoogleAuthIdToken } from './controllers/authController.js';
import authRouter from './routes/authRoute.js';

dotenv.config();

const app = express();

const port = process.env.PORT;   

app.use(bodyParser.json());
app.use(cors());

app.use('',authRouter);   
app.use('',storyRouter);   

mongoose.connect(process.env.MongoDBString, { 
  dbName: process.env.DB_NAME,  
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(() => {

  console.log("Connected to MongoDB 🚀");
  app.listen(port, () => console.log(`Server running on port ${port} 🔥`)); 


}).catch((err) => {
  console.log("Failed to connect to MongoDB 😢", err);    
});

