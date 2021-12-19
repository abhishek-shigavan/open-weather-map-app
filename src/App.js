import './App.css';
import Home from './components/Home';
import { Routes, Route} from 'react-router-dom';
import CityWeatherData from './components/CityWeatherData';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route path="/q:CityName&id:CityID" exact element={<CityWeatherData/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
