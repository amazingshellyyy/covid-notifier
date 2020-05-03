import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
import routers from './routers';
import bodyParser from 'body-parser';
//-----instanced modules-----//
//invoke express?
const app = express();

//-----configuration variable-----//
const PORT = config.domain;



//----set up db----//


mongoose.connect(config.mongoose.uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(()=> console.log('MongoDB connected...'))
  .catch((err) => console.log(`MongoDB connection error : ${err}`))



//-----Middleware----//
const coresOptions = {
    origin: ['http://localhost:3000','https://amazingshellyyy.com'],
    credentials: true,
    optionsSuccessStatus: 200
}

// const errorHandler = (err, req, res, next) => {
//     console.log('errr',err)
// }

app.use(morgan('dev'));
app.use(cors(coresOptions));
app.use(bodyParser.json());
// app.use(errorHandler);

//-----Routes----//



app.use('/', routers);

app.listen(PORT, ()=> {
    console.log(`Server connected at ${PORT}`)
})