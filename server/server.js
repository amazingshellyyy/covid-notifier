import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import routers from './routers';

//-----instanced modules-----//
//invoke express?
const app = express();

//-----configuration variable-----//
const PORT = process.env.PORT || 8080;

//-----Middleware----//
const coresOptions = {
    origin: ['http://localhost:3000','https://amazingshellyyy.com'],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(morgan('dev'));
app.use(cors(coresOptions));


//-----Routes----//



app.use('/', routers);

app.listen(PORT, ()=> {
    console.log(`Server connected at http://localhost:${PORT}`)
})