import axios from "axios";

export default class watchmenApi {

    static async createUser(employeeId, username, password) {
        try {
            return await axios.post('https://kmsadmin-production.up.railway.app/api/users', {
                username: username,
                password: password,
                employee_id: employeeId
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getUser(id) {
        try {
            return await axios.get(`https://kmsadmin-production.up.railway.app/api/users/${id}`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllUsers() {
        try {
            return await axios.get('https://kmsadmin-production.up.railway.app/api/users')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateUser(id, employeeId, username, password) {
        try {
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/users/${id}`, {
                username: username,
                password: password,
                employee_id: employeeId
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
