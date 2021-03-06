// This is supposed to script to define a Place class/prototype

let https = require('https');
// import https from 'https';
const token = process.env.GMAPS_API;

let universities = require('../../test_scripts/universities.json').map(school => {
	return school.name;
});

class Place {
	constructor({name = null, street = null, placeID = null, lat = null, long = null} = {}) {
		this.name = name;
		this.street = street;
		this.placeID = placeID;
		this.lat = lat;
		this.long = long;
	}

	getStreet() {
		return this.street;
	}

	getLat() {
		return this.lat;
    }
    
	getLong() {
		return this.long;
    }
    
	getPlaceID() {
		return this.placeID;
    }

    setStreet(val) {
		this.street = val;
    }
    
	setLat(val) {
		this.lat = val;
    }
    
	setLong(val) {
		this.long = val;
    }
    
	setPlaceID(val) {
		this.placeID = val;
    }
    
	populateAttributes() {
		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.name.replace(' ', '+')}&key=${token}`;
		https.get(url, response => {
			let body = "";
			response.on("data", data => {
				body += data;
			});
			response.on("end", () => {
				body = JSON.parse(body);
				if (body.results.length) {
					this.setStreet(body.results[0].formatted_address);
					this.setPlaceID(body.results[0].place_id);
					this.setLat(body.results[0].geometry.location.lat);
					this.setLong(body.results[0].geometry.location.lng);
				}
				// console.log(this);
			});
		}).on("error", (e) => {
			console.error(e);
		});
		// console.log(this);
    }
    
	// Get the MBTA bus stops within a 1 mile radius
	getStops() {
		// Point this call to an API with lat=this.lat&long=this.long&radius=1
    }
    
	toString() {
		return `Name: ${this.name}\nStreet Address: ${this.street}\nLatitute: ${this.lat} N\nLongitude: ${this.long} W.`;
	}
}

// The issue (maybe good thing actually) with https or http is that requests are asynchronous.
// This means that after calling Place.populateAttributes(), you have to time out a little bit
// to wait for the method to finish running in order to see the changes made.

let updatedUniversities = universities.map(name => {
	let place = new Place({name: name});
	place.populateAttributes();
	return place;
});
// mit.populateAttributes();
setTimeout(function() {
	console.log(updatedUniversities);
}, 2000);