import React, { useState, useEffect } from "react";
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY

const Filter = ({searchName, handleSearchName}) => {

  return (
    <div>
      find countries <input autoFocus='on' value={searchName} onChange={handleSearchName}/>
    </div>
  )
}

const Content = ({countriesToShow, handleShowButton, weather, setWeatherCity}) => {

  if (countriesToShow.length > 1 && countriesToShow.length < 10 ) {
    return (
      <CountryList 
        countriesToShow={countriesToShow} 
        handleShowButton={handleShowButton} 
      />
    )
  } else if (countriesToShow.length === 1) {
    return (
      <div>
        <CountryInfo 
          countriesToShow={countriesToShow}
          setWeatherCity={setWeatherCity} 
        />
        <Weather 
          weather={weather}
        />
      </div>
    )
  } else return <p>type to show results</p>

}

const CountryList = ({countriesToShow, handleShowButton}) => {
  return (
    <div>
      {countriesToShow.map((country) =>
        <div key={country.name} >
          {country.name} <button value={country.name} onClick={handleShowButton}>show</button>
        </div>  
      )}
    </div>
  )
}

const CountryInfo = ({countriesToShow, setWeatherCity}) => {
  const country = countriesToShow[0]
  // setWeatherCity(country.capital)
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <div>
        {country.languages.map((language) => 
          <li key={language.name}>
            {language.name}
          </li>
        )}
      </div>
      <br />
      <div>
        <img src={country.flag} alt='country flag' width='100'/>
      </div>
    </div>
  )

}

const Weather = ({weather}) => {
  return (
    <div>
      <h3>Weather in {weather.location.name}</h3>
      <p><b>temperature:</b> {weather.current.temperature} Celcius</p>
      <img src={weather.current.weather_icons} alt=""/>
      <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
    </div>
  )

}

function App() {

  const [ countries, setCountries ] = useState([])
  const [ countriesToShow, setCountriesToShow ] = useState([])
  const [ searchName, setSearchName ] = useState('')
  const [ weatherCity, setWeatherCity ] = useState('germany')
  const [ weather, setWeather ] = useState({})

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const visibleCountries = searchName === ''
        ? countries
        : countries.filter(country => country.name.toLowerCase().includes(searchName.toLowerCase()));
    
    setCountriesToShow(visibleCountries)
  }, [searchName, countries])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      setWeatherCity(countriesToShow[0].capital)
    }
  }, [countriesToShow])
  
  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${weatherCity}`)
      .then(response => {
        setWeather(response.data)
        console.log('called weather api')
      })
  }, [weatherCity])
  
  const handleSearchName = (e) => setSearchName(e.target.value)
  const handleShowButton = (e) => {
    const clickedCountry = countriesToShow.filter(country => country.name === e.target.value)
    setCountriesToShow(clickedCountry)
  }

  return (
    <div>
      <div>debug: {searchName}</div>
      <div>weatherCity: {weatherCity}</div>
      <Filter 
        searchName={searchName} 
        handleSearchName={handleSearchName} 
      />
      <Content 
        countriesToShow={countriesToShow}
        setCountriesToShow={setCountriesToShow}
        handleShowButton={handleShowButton}
        weather={weather}
        weatherCity={weatherCity}
        setWeatherCity={setWeatherCity}
      />
    </div>
  )
}

export default App;

