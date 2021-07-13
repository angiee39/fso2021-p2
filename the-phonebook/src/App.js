import React, { useState } from 'react'

const Filter = ({searchName, handleSearchName}) => {
  return (
    <div>
      filter name <input value={searchName} onChange={handleSearchName} />
    </div>
  )
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input 
        value={newName} 
        onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input 
        value={newNumber} 
        onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, searchName}) => {
  const namesToShow = searchName === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
  
  return (
    <div>
      {namesToShow.map((person) => 
        <div key={person.name}>
          {person.name} {person.number}
        </div>
      )}
    </div>
  )
}

const addName = ({e, persons, setPersons, newName, newNumber, setNewName, setNewNumber}) => {
  e.preventDefault()
  const name = persons.map((person) => person.name)
  const match = name.find((name) => name === newName)
  if (match === newName) {
    alert(`${newName} id already added to the phonebook`)
  }
  else {
    const nameObject = {
      name: newName,
      number: newNumber,
      id: newName
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  
  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleSearchName = (e) => setSearchName(e.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} searchName={searchName} />
    </div>
  )
}

export default App