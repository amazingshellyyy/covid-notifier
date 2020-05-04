import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class GetLocationForm extends React.Component{
    state = {
        zipCode: 123,
        successMsg: '',
        errMsg: '',
        showButton: true
    }
    inputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    sendZip = (e) => {
        e.preventDefault();
        console.log(this.props.uid);
        this.setState({
            successMsg: '',
            errMsg: ''
        })
        axios.post(`${process.env.REACT_APP_API_URL}/${this.props.uid}/setZip`, {zip:Number(this.state.zipCode)})
            .then(res => {
                
                this.setState({
                    successMsg: res.data.message,
                    errMsg:'',
                    showButton: false
                })
            })
            .catch(err => {
                this.setState({
                    errMsg: err.response.data.message,
                    successMsg: ''
                })
                console.log(err.response.data.message)
            })
    }

    render(){
        return (
            <div className="ui container">
            <form className="ui form" onSubmit={this.sendZip} style={{margin:'0 auto',marginTop:'10vh',width:'20vw', textAlign:'center'}}>
                <div className="field">
                <label>ZipCode</label>
                <input type="number" name="zipCode" onChange={this.inputChange}/>
                </div>
                {this.state.errMsg&& <p>{this.state.errMsg}</p>}
                {this.state.successMsg&& <p>{this.state.successMsg}</p>}
                {this.state.showButton && <button className="ui button" type="submit">Use this Zip Code</button>}
              </form>
            </div>
        )
    }
}

export default withRouter(GetLocationForm);


