import React from "react";
import { Map as LeafletMap, TileLayer, Circle, Popup } from "react-leaflet";
import numeral from "numeral";
const casesTypeColors = {
  cases: {
    hex: "#0A79DF",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

function Map({ countries, zoom, center, type }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {countries.map((country, index) => (
          <>
            <Circle
              key={index}
              center={[country.countryInfo.lat, country.countryInfo.long]}
              fillOpacity={0.4}
              color={casesTypeColors[type]["hex"]}
              fillColor={casesTypeColors[type]["hex"]}
              radius={
                Math.sqrt(country[type]) * casesTypeColors[type].multiplier
              }
            >
              <Popup>
                <div>
                  <div>
                    <img
                      src={country.countryInfo.flag}
                      style={{
                        width: "100px",
                        height: "50px",
                        borderRadius: "5px",
                        border: "1px solid black",
                      }}
                      alt=""
                    />
                  </div>
                  <div>
                    <h4>{country.country}</h4>
                  </div>
                  <div>
                    Cases:{" "}
                    <strong>{numeral(country.cases).format("0,0")}</strong>{" "}
                  </div>
                  <div>
                    Recovered:{" "}
                    <strong>{numeral(country.recovered).format("0,0")}</strong>{" "}
                  </div>
                  <div>
                    Deaths:{" "}
                    <strong>{numeral(country.deaths).format("0,0")}</strong>{" "}
                  </div>
                </div>
              </Popup>
            </Circle>
          </>
        ))}
      </LeafletMap>
    </div>
  );
}

export default Map;
