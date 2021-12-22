import './App.css';
import Home from './components/Home';
import { Switch, Route, Link } from 'react-router-dom';
import CityWeatherData from './components/CityWeatherData';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route path="/weather?id=CityID" component={CityWeatherData}></Route>
        <CityWeatherData/>
      </Switch>
    </div>
  );
}

export default App;
