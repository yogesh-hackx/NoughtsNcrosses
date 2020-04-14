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
        fetch(`https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?language=en&location=${this.state.lat},${this.state.long}`, {
        "method": "GET",
        "headers": {
                "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
                "x-rapidapi-key": "bc38a9bceemsh82feeb0dbc1960bp128f7fjsnfc5eba2cc5ed"
        }
})
.then(response => {
    console.log(response.json().then(resp => { 
        console.log(resp.results[0].region);
        this.setState({ state: resp.results[0].region, address: resp.results[0].address })
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
                    this.state.address ? (<div class="alert alert-success" role="alert"><p>Address: {this.state.address}</p><p>Coordinates: {`Lat: ${this.state.lat}, Long: ${this.state.long}`}</p></div>) : 
                    this.state.state ? <div class="alert alert-success" role="alert"><p>State: {this.state.state}</p><p>Coordinates: {`Lat: ${this.state.lat}, Long: ${this.state.long}`}</p><div class="alert alert-danger" role="alert">Sorry, your complete address is not available at the moment</div></div>
                    : null
                }

            </div>
        )
    }
}

export default App