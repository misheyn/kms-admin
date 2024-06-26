import axios from "axios"

export default class divisionsApi {

    static async createDivision(name) {
        try {
            return await axios.post('https://kmsadmin-production.up.railway.app/api/divisions', {
                name: name
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllDivisions() {
        try {
            return await axios.get('https://kmsadmin-production.up.railway.app/api/divisions')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateDivision(id, name) {
        try {
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/divisions/${id}`, {
                name: name
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
