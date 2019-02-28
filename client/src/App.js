import React, { Component } from 'react';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import longs from './distanceData/longitudes'
import lats from './distanceData/latitudes'
import ID from './distanceData/stopIDs'
import './App.css';
import 'typeface-roboto';

class App extends Component {
    state = {
        data: null
    };
    
    componentDidMount() {
        let lat = 0;
		let long = 0;
        let stopID = 104058;
        
        // function getLocation() {
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(showPosition);
        //     } else {
        //         // error here
        //     }
        // }
        
        function showPosition(position) {
    		//x.innerHTML = "Latitude: " + position.coords.latitude +
            //"<br>Longitude: " + position.coords.longitude;
            console.log(position)
    		lat = position.coords.latitude;
            long = position.coords.longitude;
            console.log(lat, long)
    		let i;
    		let min = 1000;
    		for (i = 0; i < lats.length; i++) {
        		let dist = ((lat - lats[i])*(lat - lats[i])) + ((long - longs[i])*(long - longs[i]));
        		if(dist < min) {
            		stopID = ID[i];
           			min = dist;
        		}
            }
            console.log("STOP", stopID)
        }

        let getPosition = function (options) {
            return new Promise(function(resolve, reject) {
                console.log(navigator.geolocation)
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(resolve, reject, options)
            })
        }

        let getStop = function (options) {
            return new Promise(function(resolve, reject) {
                resolve(showPosition(options))
            })
        }
        getPosition().then((position) => {
            getStop(position).then(() => {
                this.callBackendAPI(stopID)
            })
        })

    }

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async (data) => {
        const response = await fetch('/express_backend', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({stop: data})
        });
        const result = await response.json();
        if (response.status !== 200) {
            throw Error(result.message) 
        } else {
            this.setState({ data: result.body })
        }
    };

    render() {
        const { data } = this.state;
        const TableData = (props) => {
            return (
                data && data.departures.length && (
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
