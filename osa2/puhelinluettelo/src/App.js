import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Headline = ({ headline }) => {
	return <h2>{headline}</h2>
}

const Filter = ({ filter, setFilter }) => {
	return (
		<form>
			<div>
				filter: <input value={filter} onChange={(event) => { setFilter(event.target.value) }} />
			</div>
		</form>
	)
}

const AddPerson = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber }) => {
	const addPerson = (event) => {
		event.preventDefault()
		if (persons.map(person => person.name).indexOf(newName) === -1) {
			setPersons(persons.concat({ name: newName, number: newNumber }))
		} else {
			alert(`${newName} is already added to phonebook`)
		}
		setNewName('')
		setNewNumber('')
	}

	return (
		<form onSubmit={addPerson}>
			<div>
				name: <input value={newName} onChange={(event) => { setNewName(event.target.value) }} />
			</div>
			<div>
				number: <input value={newNumber} onChange={(event) => { setNewNumber(event.target.value) }} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const DisplayNumbers = ({ persons, filter }) => {
	return (
		persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase())).map((person, index) =>
			<p key={index}>{person.name} {person.number}</p>
		)
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

	useEffect(() => {
		axios
			.get('http://localhost:3001/persons')
			.then(response => {
				let newPersons = []
				response.data.map(person => {
					if (persons.map(contact => contact.name).indexOf(person.name) === -1) {
						newPersons.push({ name: person.name, number: person.number })
					} else {
						console.log(`${person.name} is already added to phonebook`)
					}
					return null
				})
				setPersons(persons.concat(newPersons))
			})
	}, [])

	return (
		<div>
			<Headline headline="Phonebook" />
			<Filter filter={filter} setFilter={setFilter} />
			<Headline headline="Add new" />
			<AddPerson persons={persons} setPersons={setPersons} newNumber={newNumber} setNewNumber={setNewNumber} newName={newName} setNewName={setNewName} />
			<Headline headline="Numbers" />
			<DisplayNumbers persons={persons} filter={filter} />
		</div>
	)

}

export default App