import dotenv from 'dotenv';


export default {
	domain: process.env.NODE_ENV == 'production' ? 'https://amazingshellyyy.com/covid-notifier' : '8080',
	mongoose: {
		uri: process.env.MONGODB_URI || 'mongodb://localhost/covid-notifier'
	}
}