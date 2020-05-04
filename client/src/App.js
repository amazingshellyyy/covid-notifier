import React from 'react';
import SignUp from './components/SignUpWithVerify';
import GetLoc from './components/GetLocationForm';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {
    state = {
        uid: 123
    }

    setUid = (uid) => {
        this.setState({
            uid
        })
    }

    render(){
        return (
            <Switch>
            <Route path='/zip' render={()=>(<GetLoc setUid={this.setUid} uid={this.state.uid}/>)} />
            <Route path='/' render={()=>(<SignUp setUid={this.setUid} />)} />
            </Switch>
        )
    }
}

export default App;