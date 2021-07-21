import React, { useState, useEffect } from "react";
import axios from 'axios';

const Filter = ({searchName, setSearchName}) => {
  const handleSearchName = (e) => setSearchName(e.target.value)
  return (
    <div>
      find countries <input autoFocus='on' value={searchName} onChange={handleSearchName}/>
    </div>
  )
}

const Content = ({countriesToShow, setCountriesToShow}) => {
  if (countriesToShow.length > 1 && countriesToShow.length < 10 ) {
    return (
      <CountryList 
        countriesToShow={countriesToShow}
        setCountriesToShow={setCountriesToShow}
      />
    )
  } else if (countriesToShow.length === 1) {
    return (
      <CountryInfo countriesToShow={countriesToShow}/>
    )
  } else return <p>type to show results</p>
}

const CountryList = ({countriesToShow, setCountriesToShow}) => {
  const handleShowButton = (e) => {
    const clickedCountry = countriesToShow.filter(country => country.name === e.target.value)
    setCountriesToShow(clickedCountry)
  }
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

const CountryInfo = ({countriesToShow}) => {
  const api_key = process.env.REACT_APP_API_KEY
  const country = countriesToShow[0]
  const [ weather, setWeather ] = useState(null)

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then(response => {
        setWeather(response.data)
        console.log('called weather api')
      })
  }, [])

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
      <img src={country.flag} alt='country flag' width='100'/>
      <Weather weather={weather}/>
    </div>
  )
}

const Weather = ({weather}) => {
  if (!weather) return null
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
  
  return (
    <div>
      <Filter 
        searchName={searchName} 
        setSearchName={setSearchName}
      />
      <Content 
        countriesToShow={countriesToShow}
        setCountriesToShow={setCountriesToShow}
      />
    </div>
  )
}

export default App;