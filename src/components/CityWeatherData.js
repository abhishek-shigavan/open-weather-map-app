import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import WeatherDataCard from "./WeatherDataCard";
import { makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles({
    customBoxStyle: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        flexWrap: "wrap",
        justifyContent: "center",
        alignSelf: "center",
        paddingTop: 70,
        paddingLeft: "5%"
    }
}); 


function CityWeatherData(props) {
    const styles = useStyles();
    const {CityName , CityID } = useParams();
    const [cityLatLonData, setCityLatLonData]  = useState([]);

    useEffect(()=> {
        setCityLatLonData(oldArray => [ {city_name: CityName.substring(1), city_id: CityID.substring(1)}, ...oldArray ])
    },[CityName, CityID])

    const openCityWeatherData = cityLatLonData.length >= 1 ? true : false;

    return(
        <>
            <Navbar />
            {openCityWeatherData && (
                <Box className={styles.customBoxStyle}>
                    {cityLatLonData.map(cityData => (
                        <WeatherDataCard CityName={cityData.city_name} CityID={cityData.city_id}/>
                    ))}
                </Box>
            )}
        </> 
    );
}

export default CityWeatherData;