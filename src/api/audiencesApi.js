import axios from "axios"

export default class audiencesApi {

    static async createAudience(number, capacity, audienceType) {
        try {
            return await axios.post('https://kmsadmin-production.up.railway.app/api/audiences', {
                number: number,
                capacity: capacity,
                audience_type: audienceType,
                image_id: 1
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async createKey(audienceId, main) {
        try {
            return await axios.post('https://kmsadmin-production.up.railway.app/api/keys', {
                audience_id: audienceId,
                main: main
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async generateQR(keyId) {
        try {
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/keys/${keyId}/QRs`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllAudiences() {
        try {
            return await axios.get('https://kmsadmin-production.up.railway.app/api/audiences')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllKeys() {
        try {
            return await axios.get('https://kmsadmin-production.up.railway.app/api/keys')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deleteAudience(id, number, capacity, signalisation, audienceType) {
        try {
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/audiences/${id}`, {
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
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/keys/${id}`, {
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
            return await axios.put(`https://kmsadmin-production.up.railway.app/api/audiences/${id}`, {
                number: number,
                capacity: capacity,
                signalisation: signalisation,
                audience_type: audienceType,
                exist: true,
                image_id: 1
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
