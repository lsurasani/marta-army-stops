import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        data: null
    };
    
    componentDidMount() {
        // Call our fetch function below once the component mounts
        this.callBackendAPI()
            .then(res => this.setState({ data: res.body }))
            .catch(err => console.log(err));
    }

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();
    
        if (response.status !== 200) {
          throw Error(body.message) 
        }
        return body;
    };

    render() {
        const { data } = this.state;
        return (
            <div className="main">
                <header>MARTA Army</header>
                {console.log(data)}
            </div>
        );
  }
}

export default App;
