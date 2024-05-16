import axios from "axios"

export default class divisionsApi {

    static async createDivision(name) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/divisions', {
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
            return await axios.get('https://kms2-production.up.railway.app/api/divisions')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deleteAudience(id, firstName, lastName, patronymic, employeeType) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employees/${id}`, {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                photo_url: "photo",
                employee_type: employeeType,
                employee_status: "FIRED"
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateDivision(id, name) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/divisions/${id}`, {
                name: name
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
