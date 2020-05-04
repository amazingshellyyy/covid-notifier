import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class SignUpWithVerify extends React.Component{

    state = {
        cellNum: 123,
        errMsg: '',
        showPhoneInput: true,
        showCodeInput: false,
        verifyCode: 123,
        uid:0
    }
    
    inputChange = (e) =>{
        this.setState({
           [e.target.name]: e.target.value
        })
    }

    cleanData = (data) => {
        console.log(data)
        if (data.length === 10) {
            return '+1'.concat(data)
        }
        let newDataArr = []
        for (let i = 0; i < data.length; i++) {
            if(Number(data[i])) {
                newDataArr.push(data[i])
            }
        }
        return '+1'.concat(newDataArr.join(''))
    }

    getCode = (e) => {
        e.preventDefault();
        console.log(`${process.env.REACT_APP_API_URL}/signup`)
        const cellNum = this.cleanData(this.state.cellNum);
        axios.post(`${process.env.REACT_APP_API_URL}/signup`,{cellNum})
            .then(res => {
                console.log(res.data)
                this.setState({
                    showPhoneInput: false,
                    showCodeInput: true,
                    errMsg: '',
                    uid: res.data.createdUser._id,
                    cellNum: res.data.createdUser.cellNum
                })
                console.log(this.props)
                this.props.setUid(res.data.createdUser._id);
            }).catch(err => {
                // this.setState({
                //     errMsg: err.response.data.message
                // })
                console.log(err.response)
            })
    }


    sendCode = (e) => {
        e.preventDefault();
        const {cellNum, verifyCode} = this.state;
        const bodyToSend = {
            cellNum,
            verifyCode: Number(verifyCode)
        };
        console.log(bodyToSend);
        
        axios.post(`${process.env.REACT_APP_API_URL}/${this.state.uid}/verify`,bodyToSend)
            .then(res => {
                this.props.history.push({pathname:'/zip'});
            })
            .catch(err => {
                this.setState({
                    errMsg: err.response.data.message
                })
                console.log(err.response.data.message)
            })

    }
    render(){
        return (
           <div className="ui container">
              {this.state.showPhoneInput && 
                <form className="ui form" onSubmit={this.getCode} style={{margin:'0 auto',marginTop:'10vh',width:'20vw', textAlign:'center'}}>
                <div className="field">
                <label>Phone Number</label>
                <input type="tel" name="cellNum" placeholder="123-456-7890" onChange={this.inputChange}/>
                </div>
                {this.state.errMsg&& <p>{this.state.errMsg}</p>}
                <button className="ui button" type="submit">Get Verification Code</button>
              </form>}
              {this.state.showCodeInput && 
                <form className="ui form" onSubmit={this.sendCode} style={{margin:'0 auto',marginTop:'10vh',width:'20vw', textAlign:'center'}}>
                <div className="field">
                <label>4 digit verify Code</label>
                <input type="number" name="verifyCode" placeholder='1234' onChange={this.inputChange}/>
                <a href="" onClick={this}>{"Didn't receive it? Click to send again."}</a>
                </div>
                {this.state.errMsg&& <p>{this.state.errMsg}</p>}
                <button className="ui button" type="submit">Verify</button>
              </form>}
              </div>
        )
    }
}

export default withRouter(SignUpWithVerify);