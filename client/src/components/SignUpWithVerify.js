import React from 'react';


class SignUpWithVerify extends React.Component{

    state = {
        phoneNum: 123
    }

    render(){
        return (
            <form className="ui form" style={{margin:'0 auto',marginTop:'10vh',width:'20vw', textAlign:'center'}}>
            <div className="field">
              <label>Phone Number</label>
              <input type="tel" name="phone-number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890"/>
            </div>
            
            <button className="ui button" type="submit">Get Verification Code</button>
          </form>
        )
    }
}

export default SignUpWithVerify;