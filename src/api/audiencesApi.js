import axios from "axios"

export default class audiencesApi {

    static async createAudience(number, floor, capacity, signalisation, audienceType) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/audiences', {
                number: number,
                floor: floor,
                capacity: capacity,
                signalisation: signalisation,
                audienceType: audienceType
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
    static async createKey(audienceId, main) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/keys', {
                audience_id: audienceId,
                key_state: "RETURNED",
                main: main
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
    static async getAllKeys() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/keys')
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

    static async updateKey(id, audienceId, keyState, main) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/keys/${id}`, {
                audience_id: audienceId,
                key_state: keyState,
                main: main
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
