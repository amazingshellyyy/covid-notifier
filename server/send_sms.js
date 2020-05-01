// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'ACa439eb4ab30db962f67d106bc902b2d5';
const authToken = 'e68aed3e6afffa667111fa57bf785fdf';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'It is working',
     from: '+16282658951',
     to: '+16282644375'
   })
  .then(message => console.log(message.sid));