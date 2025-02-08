import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import storyRouter from './routes/storyRoute.js'; 
import authRouter from './routes/authRoute.js';
import PingServer from './utilities/PingServer.js';
import StoryCardView from './views/StoryCardView.js';
import StoryView from './views/StoryView.js';
import CommentsView from './views/CommentsView.js';
import likesRouter from './routes/likesRoute.js';
import ratingsRouter from './routes/ratingsRoute.js';
import topRatedRouter from './routes/topRatedRoute.js';
import contributorRouter from './routes/contributorRoute.js';
import commentsRouter from './routes/commentsRoute.js';

dotenv.config();
var database = null;

const app = express();

const port = process.env.PORT;   
PingServer();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {res.status(200).send()});
app.use('',authRouter);   
app.use('',storyRouter); 
app.use('',likesRouter);   
app.use('',ratingsRouter);  
app.use('',commentsRouter);   
app.use('',topRatedRouter);   
app.use('',contributorRouter);   


mongoose.connect(process.env.MongoDBString, { 
  dbName: process.env.DB_NAME,  
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(async() => {
  
  await StoryCardView(mongoose.connection.db);
  await StoryView(mongoose.connection.db);
  await CommentsView(mongoose.connection.db);

  database = mongoose.connection.db;
  
  console.log("Connected to MongoDB 🚀");
  app.listen(port, () => console.log(`Server running on port ${port} 🔥`)); 


}).catch((err) => {
  console.log("Failed to connect to MongoDB 😢", err);    
});

export const getDb = () => database;
