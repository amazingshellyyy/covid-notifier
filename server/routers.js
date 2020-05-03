import express from 'express';
const MessagingResponse = require('twilio').twiml.MessagingResponse;
//eable express Router
const router = express.Router();
import User from './user/controller';


router.get('/', (req, res) => res.send('Hello world'));
router.post('/signup',User.sendsms, User.signup );
router.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
  
    twiml.message('The Robots are coming! Head for the hills!');
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});


export default router;
