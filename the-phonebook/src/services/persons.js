import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObect => {
    return axios.post(baseUrl, newObect)
}

const deletePerson = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const editPerson = (id, newObect) => {
    return axios.put(`${baseUrl}/${id}`, newObect)
}

export default { getAll, create, deletePerson, editPerson }
