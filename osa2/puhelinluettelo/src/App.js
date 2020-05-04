import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Headline = ({ headline }) => {
	return <h2>{headline}</h2>
}

const Error = ({ error = null }) => {
	if (error === null) {
		return null
	} else {
		let style
		if (error.type === 'fail') style = {backgroundColor: 'red'}
		else style = {backgroundColor: 'green'}
		return <div style={style}>{error.message}</div>
	}
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

const AddPerson = ({ persons, setPersons, setError, newName, setNewName, newNumber, setNewNumber }) => {
	const addPerson = (event) => {
		event.preventDefault()
		if (persons.map(person => person.name).indexOf(newName) === -1) {
			personsService.create({ name: newName, number: newNumber })
				.then(response => {
					setPersons(persons.concat(response.data))
					setError({message: `${newName} added to phonebook.`, type: 'success'})
					setTimeout(() => setError(null), 2000)
				})
				.catch(error => {
					setError({message: `Unable to add ${newName} to phonebook.`, type: 'fail'})
					setTimeout(() => setError(null), 2000)
				})
		} else {
			if (window.confirm(`${newName} is already added to phonebook. Update their number?`)) {
				personsService
					.update({ ...persons.find(person => person.name === newName), number: newNumber })
					.then(response => {
						setPersons(persons.map(person => person.name !== newName ? person : response.data))
						setError({message: `${newName}'s number updated.`, type: 'success'})
						setTimeout(() => setError(null), 2000)
					})
					.catch(error => {
						setPersons(persons.filter(person => person.name !== newName))
						setError({message: `Unable to update ${newName}'s number.`, type: 'fail'})
						setTimeout(() => setError(null), 2000)
					})
			}
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

const DisplayNumbers = ({ persons, setPersons, setError, filter }) => {

	const removeNumber = (id, name) => {
		if (window.confirm(`Remove ${name}?`)) {
			personsService
				.remove(id)
				.then(() => {
					setPersons(persons.filter(person => person.id !== id))
					setError({message: `${name} removed from phonebook.`, type: 'success'})
					setTimeout(() => setError(null), 2000)
				})
				.catch(error => {
					setPersons(persons.filter(person => person.id !== id))
					setError({message: `Unable to remove ${name} from phonebook.`, type: 'fail'})
					setTimeout(() => setError(null), 2000)
				})
		}
	}

	return (
		persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase())).map((person, index) =>
			<div key={index}>
				{person.name} {person.number}
				<button onClick={() => removeNumber(person.id, person.name)}>Remove</button>
			</div>
		)
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	const [error, setError] = useState(null)

	useEffect(() => {
		personsService.getAll()
			.then(response => {
				let newPersons = []
				response.data.map(person => {
					if (persons.map(contact => contact.name).indexOf(person.name) === -1) {
						newPersons.push({ id: person.id, name: person.name, number: person.number })
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
			<Error error={error} />
			<Filter filter={filter} setFilter={setFilter} />
			<Headline headline="Add new" />
			<AddPerson persons={persons} setPersons={setPersons} setError={setError} newNumber={newNumber} setNewNumber={setNewNumber} newName={newName} setNewName={setNewName} />
			<Headline headline="Numbers" />
			<DisplayNumbers persons={persons} setPersons={setPersons} setError={setError} filter={filter} />
		</div>
	)

}

export default App