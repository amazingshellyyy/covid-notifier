import dotenv from 'dotenv';
import path from 'path'

if (process.env.NODE_ENV != 'production') {
    dotenv.config({ path: path.resolve(__dirname, '.env') });
  }
export default {
	mongoose: {
		uri: process.env.MONGODB_URI || 'mongodb://localhost/covid-notifier'
    },
    twilio: {
        sid: process.env.TWILIO_SID,
        token: process.env.TWILIO_TOKEN
    },
    environment: process.env.NODE_ENV || 'development'
}