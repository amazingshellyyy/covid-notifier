
export default {
	domain: process.env.NODE_ENV == 'production' ? 'https://amazingshellyyy.com/covid-notifier' : '8080',
	mongoose: {
		uri: process.env.MONGODB_URI || 'mongodb://localhost/covid-notifier'
    },
    twilio: {
        sid: process.env.NODE_ENV == 'production' ? process.env.TWILIO_SID : 'ACa439eb4ab30db962f67d106bc902b2d5',
        token: process.env.NODE_ENV == 'production' ? process.env.TWILIO_TOKEN : 'e68aed3e6afffa667111fa57bf785fdf'
    }
}