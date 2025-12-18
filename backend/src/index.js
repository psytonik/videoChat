import express from 'express';
import cors from 'cors';
import path from "path";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";
import chatRoute from "./routes/chat.route.js";

import mongoConnect from "./config/mongoConnect.js";

const app = express();
const port = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);

if(process.env.NODE_ENV === 'production') {
    console.log(express.static(path.join(__dirname,'../frontend/dist')), 'HERE IM')
    app.use(express.static(path.join(__dirname,'../frontend/dist')));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname,'../frontend', '/dist', '/index.html'));
    })
}
app.listen(port,async () => {
    console.log(`Listening on port ${port}`)
    await mongoConnect()
    }
)