import React from 'react'

class App extends React.Component {
    
    state = {
        lat: null,
        long: null,
        state: null,
        address: null
    }

    success = (position) => {
        this.setState({ lat: position.coords.latitude, long: position.coords.longitude})
        fetch(`http://www.geoplugin.net/extras/location.gp?lat=${this.state.lat}&lon=${this.state.long}&format=json`, {
        "method": "GET"
})
.then(response => {
    console.log(response.json().then(resp => { 
        console.log(resp.geoplugin_region);
        this.setState({ state: resp.geoplugin_region })
    }));
})
.catch(err => {
        console.log(err);
});
    }

    fetchState = () => {
        navigator.geolocation.getCurrentPosition(this.success);
    }

    render(){
        return(
            <div className="container">
                <button className="btn btn-primary" onClick={this.fetchState}>Click to get your location:</button>
                {
                    this.state.address ? (<div className="alert alert-success" role="alert"><p>Address: {this.state.address}</p><p>Coordinates: {`Lat: ${this.state.lat}, Long: ${this.state.long}`}</p></div>) : 
                    this.state.state ? <div className="alert alert-success" role="alert"><p>State: {this.state.state}</p><p>Coordinates: {`Lat: ${this.state.lat}, Long: ${this.state.long}`}</p></div>
                    : null
                }

            </div>
        )
    }
}

export default App