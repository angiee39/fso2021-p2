import React, { useState, useEffect } from "react";
import axios from 'axios';

// const weatherAPI = '8c4b588b4d9ddb4f27105980d2d1085d'
const api_key = process.env.REACT_APP_API_KEY

const Filter = ({searchName, handleSearchName}) => {
  return (
    <div>
      find countries <input autoFocus='on' value={searchName} onChange={handleSearchName}/>
    </div>
  )
}

const Countries = ({showCountries, searchName, buttonClick, handleButtonClick, weather, city, setCity}) => {
  const countriesToShow = searchName === ''
    ? showCountries
    : showCountries.filter(country => country.name.toLowerCase().includes(searchName.toLowerCase()));

 
  const countryInfo = (index) => {
    const country = countriesToShow[index]
    const location = country.capital
    setCity(location)
    console.log('countryInfo', city)

    return (
      <div>
        <h2>{country.name}</h2>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h3>Languages</h3>
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
        <h3>Weather in {weather.location.name}</h3>
        <p><b>temperature:</b> {weather.current.temperature} Celcius</p>
        <img src={weather.current.weather_icons} alt=""/>
        <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
        
      </div>
    )
  }

  if (countriesToShow.length === 1) {
    return countryInfo(0)

  } else if (buttonClick.value === true) {
    
    const index = countriesToShow.findIndex(country => country.name === buttonClick.country)
    return countryInfo(index)

  } else if (countriesToShow.length > 0 && countriesToShow.length < 10) {
    return (
      <div>
        {countriesToShow.map((country) => 
          <div key={country.name}>
            {country.name} <button onClick={handleButtonClick} >show</button>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <p>too many matches, specify another filter</p>
    )
  }
}

function App() {
  const [ showCountries, setShowCountries ] = useState([])
  const [ searchName, setSearchName ] = useState('')
  const [ weather, setWeather ] = useState({})
  const [ buttonClick, setButtonClick] = useState({value:false, country:''})
  const [ city, setCity ] = useState('New York')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setShowCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const obj = {value: false, country: ''}
    setButtonClick(obj)
  }, [searchName])

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${city}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [city])


  const handleSearchName = (e) => setSearchName(e.target.value)
  const handleButtonClick = (e) => {
    const country = e.target.previousSibling.wholeText.trim()
    const obj = {value: true, country: country}
    setButtonClick(obj)
  }
  return (
    <div>
      <Filter searchName={searchName} 
        handleSearchName={handleSearchName} 
      />
      <Countries 
        showCountries={showCountries} 
        searchName={searchName}
        weather={weather}
        buttonClick={buttonClick}
        handleButtonClick={handleButtonClick}
        city={city}
        setCity={setCity}
      />
    </div>
  );
}

export default App;