import axios from "axios"

export default class audiencesApi {

    static async createAudience(number, capacity, audienceType) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/audiences', {
                number: number,
                capacity: capacity,
                audience_type: audienceType
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

    static async deleteAudience(id, number, capacity, signalisation, audienceType) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/audiences/${id}`, {
                number: number,
                capacity: capacity,
                signalisation: signalisation,
                audience_type: audienceType,
                exist: false
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

    static async updateAudience(id, number, capacity, signalisation, audienceType) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/audiences/${id}`, {
                number: number,
                capacity: capacity,
                signalisation: signalisation,
                audience_type: audienceType,
                exist: true
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
