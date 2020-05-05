import User from './model';
import axios from 'axios';
import config from '../config';
//twilio
const accountSid = config.twilio.sid;
const authToken = config.twilio.token;
const client = require('twilio')(accountSid, authToken);

const send_sms = (message, to) => {
    return new Promise((resolve, reject)=> {

        
        client.messages
                .create({
                    body: message,
                    from: '+16282658951',
                    to: to
                })
                .then(res => resolve('send sms successfully'))
                .catch(err => {
                    reject(err)
                })
    })
}

export default {
    signup: async(req, res, next) => {
        
        try {
            const foundUser = await User.findOne({cellNum:req.body.cellNum});
            if(foundUser){
                return res.status(500).json({message:'this cellphone number is already registered! Try another one.'})
            }
        } catch(err) {
            return res.status(500).json({message:'something wrong'})
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
           return res.status(500).json({err,message:'something wrong when try to create user'})
       }
    },
    verify: async(req, res) => {
        
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
            let curCase = 'no report';
            console.log(req.body.zip)
            const Info = await axios.get(`https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${req.body.zip}?key=${process.env.ZIP_API_KEY}`)
            const data = Info.data;
            const cleanData = JSON.parse(`{${data.slice(6)}`);
            console.log(cleanData);

            
            try {
                const countyCases = await axios.get('https://amazingshellyyy.com/covid19-api/US-CA/current.json');
                for (let i = 0; i < countyCases.data.data.length; i++) {
                    const county = countyCases.data.data[i];
                    if(county.county.toLowerCase() === cleanData.County.toLowerCase()){
                        curCase = county.case;
                        break;
                    }
                }
                const updatedUser = await User.findByIdAndUpdate(req.params.uid,{zipCode:req.body.zip});

                const capitalize = (string) => {
                    const workingArr = string.split(' ');
                    const newArr = []
                    for (let i = 0; i < workingArr.length; i++) {
                        const name = workingArr[i];
                        newArr.push(name.charAt(0).toUpperCase().concat(name.slice(1,name.length)))
                    }
                    return newArr.join(' ')
                }
                
                if (typeof(curCase) == "string") {
                    await send_sms(`There is no report Covid19 cases at ${capitalize(cleanData.County.toLowerCase())}, ${capitalize(cleanData.State)}. see more information on https://mapitout.github.io/#/covid19`, updatedUser.cellNum)
                } else {
                    await send_sms(`There are ${curCase} Covid19 cases at ${capitalize(cleanData.County.toLowerCase())}, ${capitalize(cleanData.State)}. see more information on https://mapitout.github.io/#/covid19`, updatedUser.cellNum)
                }
                res.status(200).json({message:'Please check your phone for your first text from us!'});
            } catch(err) {
                console.log(err);
                return res.status(500).json({message:'something went wrong, try again later'})
            }

        } catch(err){
            console.log(err)
            return res.status(500).json({message: 'something went wrong when try to get the county, try again later'})
        }
    }
}
