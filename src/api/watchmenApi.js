import axios from "axios";

export default class watchmenApi {

    static async createUser(employeeId, username, password) {
        try {
            return await axios.post(`https://kms2-production.up.railway.app/api/employees/${employeeId}/user`, {
                username: username,
                password: password
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getUser(id) {
        try {
            return await axios.get(`https://kms2-production.up.railway.app/api/users/${id}`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllUsers() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/users')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateUser(id, username, password) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/users/${id}`, {
                username: username,
                password: password
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
