import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CityWeatherData() {
    const styles = useStyles();
    const navigate = useHistory();
    const query = useQuery();
    const [cityIdList, setCityIdList]  = useState([]);

    useEffect(()=> {
        query.get("id") === null ? console.log("home") : setCityIdList(query.get("id").split(',')); 
    },[query.get("id")])
    
    const removeCityByIndex = (position) => {
        cityIdList.splice(position,1);
        if(cityIdList.length > 0) {
            let cityIdString = "";
            cityIdList.forEach(cityId => { let temp = cityId;
                cityIdString = cityIdString + temp +","
            })
            navigate.push(`/weather?id=${cityIdString.slice(0, -1)}`)
        }
        else if(cityIdList.length === 0) { 
            navigate.push("/");
        }     
    }

    const openCityWeatherData = cityIdList.length > 0 ? true : false;

    return(
        <>
            <Navbar />
            {openCityWeatherData && (
                <Box className={styles.customBoxStyle}>
                    {cityIdList.map((cityId, cityPositionInData) => (
                        <WeatherDataCard position={cityPositionInData}  CityID={cityId} removeCityCard={removeCityByIndex}/>
                    ))}
                </Box>
            )}
        </> 
    );
}

export default CityWeatherData;