import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  CardContent,
  Card,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import "./style.css";
import "leaflet/dist/leaflet.css";

function App() {
  //States
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [type, setType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 24.80746, lng: -10.4796 });
  const [mapZoom, setzoom] = useState(2);
  const [date, setDate] = useState();
  // Functionssss

  const getCountries = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const refinedData = data.map((item) => ({
          name: item.country,
          value: item.countryInfo.iso3,
        }));

        setCountries(refinedData);
        setTableData(data);
        setMapCountries(data);
      })
      .catch((err) => console.log(err));

    await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  };

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 24.80746, lng: -10.4796 });
          setzoom(2);
        } else {
          setMapCenter({
            lat: data.countryInfo.lat,
            lng: data.countryInfo.long,
          });
          setzoom(4);
        }

        console.log(data);
      });
  };

  // Use effect
  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries?sort=cases")
      .then((response) => response.json())
      .then((data) => {
        const refinedData = data.map((item) => ({
          country: item.country,
          cases: item.cases,
        }));

        setTableData(refinedData);
      });
  }, []);

  useEffect(() => {
    const date = new Date();
    setDate(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        {/* ----------------header------------------ */}

        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <h2>Date: {date}</h2>
          <FormControl>
            <Select
              variant="outlined"
              color="primary"
              style={{ backgroundColor: "white" }}
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* ----------------info boxes------------------ */}
        <div className="app__stats">
          <InfoBox
            title="Cases"
            cases={countryInfo.todayCases}
            setType={setType}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            setType={setType}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            setType={setType}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>

        {/* ----------------map------------------ */}
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          type={type}
        ></Map>
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          Vignesh Nallasamy
        </div>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3> Overall cases by country</h3>
          <Table countries={tableData} />

          <h3 style={{ marginTop: "20px" }}>World Wide Daily {type} </h3>
          <LineGraph type={type} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
