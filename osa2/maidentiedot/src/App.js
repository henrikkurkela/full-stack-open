import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, setFilter }) => {
	return (
		<form>
			<div>
				filter: <input value={filter} onChange={(event) => { setFilter(event.target.value) }} />
			</div>
		</form>
	)
}

const Weather = ({capital}) => {
	const [weather, setWeather] = useState({
		current: {
			temperature: 0,
			weather_icons: 0,
			wind_speed: 0,
			wind_dir: 0
		}
	})

	useEffect(() => {
		axios
			.get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${capital}`)
			.then(response => {
				console.log(response)
				setWeather(response.data)
			})
	}, [])

	return (
		<div>
			<h3>Weather in {capital}</h3>
			<p>Temperature: {weather.current.temperature} C</p>
			<img src={weather.current.weather_icons}></img>
			<p>Wind: {weather.current.wind_speed} mph {weather.current.wind_dir}</p>
		</div>
	)
}

const CountriesList = ({ countries, filter, setFilter }) => {
	let matching = countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase())).length
	console.log(matching)

	if (matching > 10) {
		return <p>Too many matches, specify another filter</p>
	} else if (matching > 1) {
		return (
			countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase())).map((country, index) =>
				<>
				{country.name} <button key={index} onClick={() => setFilter(country.name)}>Show</button><br />
				</>
			)
		)
	} else if (matching == 1) {
		let country = countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))[0]
		const style = {
			width: '200px'
		}
		return (
			<div>
				<h2>{country.name}</h2>
				<p>Capital: {country.capital}</p>
				<p>Population: {country.population}</p>
				<h3>Languages</h3>
				<ul>
					{country.languages.map((language, index) => <li key={index}>{language.name}</li>)}
				</ul>
				<img style={style} src={country.flag}></img>
				<Weather capital={country.capital} />
			</div>
		)
	} else {
		return <p>No matches, specify another filter</p>
	}
}

function App() {
	const [filter, setFilter] = useState('')
	const [countries, setCountries] = useState([])
	let newCountries = []

	useEffect(() => {
		axios
			.get('https://restcountries.eu/rest/v2/all')
			.then(response => {
				response.data.map(country => {
					newCountries.push({ name: country.name, capital: country.capital, population: country.population, languages: country.languages, flag: country.flag })
					return null
				})
				setCountries(newCountries)
			})
	}, [])

	return (
		<div>
			<Filter filter={filter} setFilter={setFilter} />
			<CountriesList filter={filter} setFilter={setFilter} countries={countries} />
		</div>
	)
}

export default App;
