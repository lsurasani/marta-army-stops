import React, { Component } from 'react';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './App.css';
import 'typeface-roboto';

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

        const TableData = (props) => {
            return (
                data && (
                    data.departures.map((d) => {
                        const newTime = moment(d.time, "HH:mm:ss A")
                        const formatTime = newTime.format("h:mm A")
                        if (newTime.isBefore(moment())) {
                            return null
                        }
                        return (
                            <TableRow key={d.trip_id}>
                                <TableCell>{d.route}</TableCell>
                                <TableCell>{d.destination}</TableCell>
                                <TableCell>{d.wait}</TableCell>
                                <TableCell>{formatTime}</TableCell>
                            </TableRow>
                        )
                    })
                    
                )
            )
        }

        return (
            <div className="main">
                <header>MARTA Army</header>
                {data && <h3>Current Stop Data for: {data.stop_name}</h3>}
                {data && data.departures && (
                    <Table className="tables">
                        <TableHead>
                            <TableRow>
                                <TableCell>Route Number</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Arriving in...(min)</TableCell>
                                <TableCell>Expected Arrival Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableData/>
                        </TableBody>
                    </Table>
                )}
            </div>
        );
  }
}

export default App;
