import User from './model';

//twilio
const accountSid = 'ACa439eb4ab30db962f67d106bc902b2d5';
const authToken = 'e68aed3e6afffa667111fa57bf785fdf';
const client = require('twilio')(accountSid, authToken);

export default {
    signup: async(req, res, next) => {
        console.log(req.body)
       try{
           const createdUser = await User.create(req.newuser);
           res.status(200).json({message: 'just create a temp user', createdUser})
       } catch(err) {
           return res.status(500).json({err})
       }
    },
    sendsms: (req, res, next) => {
        const verifyCode = Math.floor(Math.random()*(10000-1000) + 1000);
        req.newuser = {
            ...req.body,
            verifyCode
        }
        client.messages
            .create({
                body: `Verification Code: ${verifyCode} `,
                from: '+16282658951',
                to: req.body.cellNum
            })
            .then(message => next())
            .catch(()=> res.status(500))
    }
}
