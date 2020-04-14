import React from 'react'

class App extends React.Component {
    
    state = {
        lat: null,
        long: null,
        state: null
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
        this.setState({ state: resp.results[0].region })
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
            <div>
                <button onClick={this.fetchState}>Click to get your state:</button>
                {
                    this.state.state ? (<p>State Found: {this.state.state}</p>) : null
                }

            </div>
        )
    }
}

export default App