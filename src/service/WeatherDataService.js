import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5/find?";
const API_KEY = "704cad17de7e40ab39cff1ff5eb057a7";

export const getDataByCityName = async function(cityName) {
    const response = await axios.get(`${BASE_URL}q=${cityName}&appid=${API_KEY}`);
    return response;
}

export const getDataByCityId = async function(cityId) {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}`);
    return response;
}

export const getDataByLatLon = async function(latitude, longitude) {
    const response = await axios.get(`https://openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`);
    return response;
}