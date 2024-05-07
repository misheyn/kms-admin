import axios from "axios";

export default class watchmenApi {

    static async createWatchman(firstName, lastName, patronymic) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/employees', {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                photo_url: "photo",
                employee_type: "WATCHMAN",
                employee_status: "WORKS"
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

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

    static async deleteWatchman(id, firstName, lastName, patronymic) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employees/${id}`, {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                photo_url: "photo",
                employee_type: "WATCHMAN",
                employee_status: "FIRED"
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateWatchman(id, firstName, lastName, patronymic) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employees/${id}`, {
                    first_name: firstName,
                    second_name: lastName,
                    middle_name: patronymic,
                    photo_url: "photo",
                    employee_type: "WATCHMAN",
                    employee_status: "WORKS"
                })
                .then(response => response)
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
