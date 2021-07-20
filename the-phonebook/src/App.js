import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'


const Filter = ({searchName, handleSearchName}) => {
  return (
    <div>
      filter name <input value={searchName} onChange={handleSearchName} />
    </div>
  )
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addName}) => {
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

const Persons = ({persons, searchName, deleteName}) => {
  const namesToShow = searchName === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
  
  return (
    <div>
      {namesToShow.map((person) => 
        <div key={person.name}>
          {person.name} {person.number} <button onClick={() => deleteName(person.id)}>delete</button>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ message, setMessage ] = useState({type: '', display: null})

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (e) => {
    e.preventDefault()
    const name = persons.map((person) => person.name)
    const match = name.find((name) => name === newName)
    if (match === newName) {
      if (window.confirm(`${newName} id already added to the phonebook, replace the old number with the new one?`)) {
        const id = persons.find(person => person.name === newName).id
        editNumber(id)
        setMessage({type: 'success', display: `${newName} edited`})
          setTimeout(() => {
            setMessage({type: '', display: null})
          }, 4000)
      } else return
    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber,
        id: newName
      }
      
      personService
        .create(nameObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage({type: 'success', display: `${newName} added`})
          setTimeout(() => {
            setMessage({type: '', display: null})
          }, 4000)
        })

    }
  }

  const deleteName = (id) => {
    if (window.confirm(`delete ${persons.find(person => person.id === id).name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
    else return
  }

  const editNumber = (id) => {
    const newObject = {
      name: newName,
      number: newNumber,
      id: newName
    }
    personService
      .editPerson(id, newObject)
      .then(response => {
        const obj = persons.filter(person => person.id !== id).concat(response.data)
        setPersons(obj)
      })
      .catch(error => {
        setMessage({type: 'error', display: `${newName} has already been removed`})
        setTimeout(() => {
          setMessage({type: '', display: null})
        }, 4000)
      })
  }

  const Notification = ({message}) => {
    if (message.display === null) {
      return null
    } else if (message.type === 'error') {
      return (
        <div className='error'>
          {message.display}
        </div>
      )
    }
    return (
      <div className='success'>
        {message.display}
      </div>
    )
  }


  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleSearchName = (e) => setSearchName(e.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        searchName={searchName} deleteName={deleteName}
      />
    </div>
  )
}

export default App