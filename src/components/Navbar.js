import React, { useEffect, useState } from "react";
import "../sass/Navbar.scss";
import { TextField, Button, makeStyles, InputAdornment, Box, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { ListItemButton, Popper, Snackbar, Alert, ClickAwayListener } from "@mui/material";
import { getDataByCityName } from "../service/WeatherDataService";
import { useHistory, useLocation } from "react-router-dom";
import clearSky from "../assets/clearSky.png";
import overcastCloud from "../assets/overcastClouds.png";
import sunCloud from "../assets/sunCloud.png";
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles({
    ['@media(max-width: 475px) and (min-width: 320px)'] : {
        customTextfield: {
            width: 280,
            height: 32,
            paddingLeft: 10,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            borderRadius: 3
        },
        customButton: {
            height: 33,
            width: 70,   
            backgroundColor: '#48484A',
            borderRadius: '0px 3px 3px 0px',
            color: 'white',
            textTransform: "none",
            '&:hover': {
                backgroundColor: '#252526',
            }
        },
        customBoxStyle: {
            position: "relative",
            width: 220,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: "0px",
            borderRadius: '0px 0px 3px 3px',
            left: -69,
            top: -1
        },
        customSnackBar: {
            marginTop: 100,
            width: 280
        },
        customList: {
            borderRadius: '0px 0px 3px 3px',
            paddingTop: 0,
            paddingBottom: 0
        },
        customListItem: {
            padding: 0,
            height: 36
        },
        customListItemButton: {
            height: 36,
            paddingLeft: 0
        },
        customTypographyCityCountry: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            fontSize: 12,
            width: 130
        },
        customTypographyTemperature: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            fontSize: 11,
            width: 30
        },
        customWeatherIcon: {
            width: 18,
            height: 18
        },
        customTypographyLatLon: {
            width: 0,
            fontSize: 0,
        },
        customBoxForSpinner: {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 220,
            height: 50,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: 0,
            borderRadius: '0px 0px 3px 3px',
            left: -69,
            top: -1
        }
    },
    ['@media(max-width: 1049px) and (min-width: 768px)'] : {
        customTextfield: {
            width: 625,
            height: 32,
            paddingLeft: 10,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            borderRadius: 3
        },
        customButton: {
            height: 33,
            width: 120,   
            backgroundColor: '#48484A',
            borderRadius: '0px 3px 3px 0px',
            color: 'white',
            textTransform: "none",
            '&:hover': {
                backgroundColor: '#252526',
            }
        },
        customInputAdornment: {
            margin: 0,
        },
        customBoxStyle: {
            position: "relative",
            width: 515,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: 0,
            borderRadius: '0px 0px 3px 3px',
            left: -119,
            top: -1
        },
        customSnackBar: {
            marginTop: 100,
            width: 400
        },
        customList: {
            borderRadius: '0px 0px 3px 3px',
            padding: 0
        },
        customListItem: {
            padding: 0,
            height: 36
        },
        customListItemButton: {
            height: 36,
        },
        customTypographyCityCountry: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 170
        },
        customTypographyTemperature: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 83
        },
        customTypographyLatLon: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: 170,
            fontSize: 11,
            color: "grey"
        },
        customBoxForSpinner: {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 515,
            height: 50,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: 0,
            borderRadius: '0px 0px 3px 3px',
            left: -119,
            top: -1
        }
    },    
    ['@media(max-width: 1366px) and (min-width: 1050px)']  : {
        customTextfield: {
            width: 625,
            height: 32,
            paddingLeft: 10,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            borderRadius: 3
        },
        customButton: {
            height: 33,
            width: 120,   
            backgroundColor: '#48484A',
            borderRadius: '0px 3px 3px 0px',
            color: 'white',
            textTransform: "none",
            '&:hover': {
                backgroundColor: '#252526',
            }
        },
        customInputAdornment: {
            margin: 0,
        },
        customBoxStyle: {
            position: "relative",
            width: 515,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: 0,
            borderRadius: '0px 0px 3px 3px',
            left: -119
        },
        customSnackBar: {
            marginTop: 100,
            width: 400
        },
        customList: {
            borderRadius: '0px 0px 3px 3px',
            padding: 0
        },
        customListItem: {
            padding: 0,
            height: 36
        },
        customListItemButton: {
            height: 36,
        },
        customTypographyCityCountry: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 170
        },
        customTypographyTemperature: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 83
        },
        customTypographyLatLon: {
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: 170,
            fontSize: 11,
            color: "grey"
        },
        customBoxForSpinner: {
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 515,
            height: 50,
            backgroundColor: "white",
            border: "1px solid lightgrey",
            borderTop: 0,
            borderRadius: '0px 0px 3px 3px',
            left: -119
        }
    }
})

function useCityId() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Navbar() {
    const classes = useStyles();
    const history = useHistory();
    const cityInParams = useCityId();
    const vertical = "top";
    const horizontal = "center";
    const [anchorEl, setAnchorEl] = useState(null);
    const [inputCityName, setInputCityName] = useState("");
    const [searchCityResult, setSearchCityResult] = useState([]);
    const [cityNotFound, setCityNotFound] = useState(false);
    const [cityIdList, setCityIdList] = useState([]);
    const [renderingState, setRenderingState] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        if(cityInParams.get("id") !== null) setCityIdList(cityInParams.get("id").split(','));
    },[cityInParams])

    useEffect(() => {
       sendSearchCityData(cityIdList); 
    },[renderingState])

    const handleUserInput = (event) => {
        setInputCityName(event.target.value);
    }

    const handleSearchClick = (event) => {
        setDataLoading(true);
        getDataByCityName(inputCityName).then((res) => {
            res.data.list.length ? setSearchCityResult(res.data.list) : setCityNotFound(true)
            setDataLoading(false);
        }).catch((err) =>{
            setDataLoading(false);
            setCityNotFound(true);
            console.log(err);
        })
        setAnchorEl(anchorEl ? null : event.currentTarget)
    }

    const handleClickAway = () =>  {
        setInputCityName("");
        setAnchorEl(null);
        setSearchCityResult([]);
    }
    
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setInputCityName("");
        setCityNotFound(false);
    };

    const sendSearchCityData = (cityIdList) => {
        let cityIdString ="";
        if(cityIdList.length > 0 && cityIdList.length <= 5) {
            cityIdString = getCityIdString();
            history.push(`/weather?id=${cityIdString}`);
        }
        else if (cityIdList.length > 5) {
            cityIdString = removeOldCityId();
            history.push(`/weather?id=${cityIdString}`);
        }    
    }

    const getCityIdString = () => {
        let cityIdString = "";
        cityIdList.forEach(cityId => { let temp = cityId;
            cityIdString = cityIdString + temp +","
        })
        return(cityIdString.slice(0, -1))
    }

    const removeOldCityId = () => {
        cityIdList.pop();
        const cityId =  getCityIdString();
        return cityId;
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return(
        <>
            <div className="navbar-outer-container">
                <TextField
                    placeholder={"Search city"}
                    value={inputCityName}
                    onChange={handleUserInput} 
                    className={classes.customTextfield}
                    InputProps={{disableUnderline: true,
                        endAdornment:(
                            <InputAdornment className={classes.customInputAdornment} position="end">
                                <Button aria-describedby={id} className={classes.customButton} onClick={handleSearchClick}>Search</Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <Popper id={id} open={open} anchorEl={anchorEl} placement={"bottom-start"}>
                <ClickAwayListener onClickAway={() => handleClickAway()}>
                {dataLoading ? (
                    <Box className={classes.customBoxForSpinner}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box className={classes.customBoxStyle}>
                        {searchCityResult.map(city =>(
                            <List className={classes.customList}>
                                <ListItem className={classes.customListItem}>
                                    <ListItemButton 
                                        className={classes.customListItemButton} 
                                        dense={true} 
                                        onClick={() => {
                                                    setInputCityName(""); 
                                                    setCityIdList(oldId => [city.id, ...oldId]);
                                                    setRenderingState(!renderingState);    
                                                    handleClickAway();
                                                }}
                                    >
                                        <ListItemText>
                                        <div className="dropdown-menu-option">
                                            <Typography className={classes.customTypographyCityCountry}>{city.name+", "+city.sys.country}</Typography>
                                            <Typography className={classes.customTypographyTemperature}>{~~(city.main.temp)+ "\u00B0 C"}</Typography>
                                            <img src={ city.weather[0].main === "Clear" ? clearSky
                                                        : city.weather[0].main === "Clouds" ? overcastCloud
                                                        : sunCloud} alt="" className={classes.customWeatherIcon}
                                            />
                                            <Typography className={classes.customTypographyLatLon}>{"lat "+city.coord.lat+", lon "+city.coord.lon}</Typography> 
                                        </div>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        ))}
                    </Box>
                )}    
                </ClickAwayListener>
            </Popper>
            <Snackbar className={classes.customSnackBar} open={cityNotFound} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} variant="filled" severity="info" sx={{ width: '100%' }}>
                    No results for {inputCityName}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Navbar;