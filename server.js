
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from './routes/artistRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() =>{ 
    console.log("MongoDB connected")
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        })
    })
    .catch(err => console.log(err));

app.use('/api/artists', route);