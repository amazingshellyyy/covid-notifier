import User from './model';
import axios from 'axios';
import config from '../config';
//twilio
const accountSid = config.twilio.sid;
const authToken = config.twilio.token;
const client = require('twilio')(accountSid, authToken);

const send_sms = (message, to) => {
    client.messages
            .create({
                body: message,
                from: '+16282658951',
                to: to
            })
            .then(res => res)
            .catch(()=> res.status(500))
}

export default {
    signup: async(req, res, next) => {
        console.log(req.body)
        try {
            const foundUser = await User.findOne({cellNum:req.body.cellNum});
            if(foundUser){
                return res.status(500).json({message:'this cellphone number is already registered! Try another one.'})
            }
        } catch(err) {
            return res.status(500).json({messagez:'something wrong'})
        }
        const verifyCode = Math.floor(Math.random()*(10000-1000) + 1000);
        req.newuser = {
            ...req.body,
            verifyCode
        }
        
        await send_sms(`Verify Code:${verifyCode}`, req.body.cellNum);
        
       try{
           const createdUser = await User.create(req.newuser);
           res.status(200).json({message: 'just create a temp user', createdUser})
       } catch(err) {
           return res.status(500).json({err})
       }
    },
    verify: async(req, res) => {
        console.log(req.params)
        try{

            const foundUser = await User.findById(req.params.uid);
            if(!foundUser){
                return res.status(500).json({message:'user do not exist'})
            }
            if(req.body.verifyCode === foundUser.verifyCode){
                res.status(200).json({message:'User verified'})
            } else {
                res.status(500).json({message:'incorrect verify code, please try again'})
            }
        } catch(err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    setZip: async( req, res ) => {
        if (req.body.zip < 10000) {
            return res.status(500).json({message: 'This zip code is invalid. Please try again.'})
        }
        if (req.body.zip < 90001 || req.body.zip > 96162) {
            return res.status(500).json({message: 'This zip code is not in California. Please try again.'})
        }
        try {
            let curCase = 'no report yet';
            console.log(req.params.uid)
            console.log(req.body.zip)
            const Info = await axios.get(`https://www.zipcodeapi.com/rest/JyMTpydCOpnE0yDFIeSBPfgpxgbVHeJMynIc4XKMyTEl8nVGDh4MVs8YzUcpikXr/info.json/${req.body.zip}/degrees`)
            console.log(Info.data.city);
            try {
                const countyCases = await axios.get('https://amazingshellyyy.com/covid19-api/US-CA/current.json');
                console.log(countyCases.data.data)
                for (let i = 0; i < countyCases.data.data.length; i++) {
                    const county = countyCases.data.data[i];
                    if(county.county.toLowerCase() === Info.data.city.toLowerCase()){
                        curCase = county.case;
                        break;
                    }
                }
                const updatedUser = await User.findByIdAndUpdate(req.params.uid,{zipCode:req.body.zip});
                
                send_sms(`This is your first case report: current Covid Case at ${Info.data.city} : ${curCase}`, updatedUser.cellNum)
                res.status(200).json({message:'Please check your phone for your first text from us!'});
            } catch(err) {
                return res.status(500).json({message:'something went wrong, try again later'})
            }

        } catch(err){
            return res.status(500).json({message: 'something went wrong when try to get the county, try again later'})
        }
    }
}
