import React, { Component } from "react";
import { render } from 'react-dom';
import GoogleMaps from "simple-react-google-maps"


export default class Maps extends Component {
    render() {
        return(
            <div>
                <GoogleMaps
                style={{ height: "500px", width: "900px" }}
                zoom={10}
                center={{
                    lat: -33.30209743292718, lng: -66.33694331888634,
                }}
                />
            </div>
        );
    };
};


