import axios from "axios"

export default class shiftsApi {

    static async getAllShifts() {
        try {
            return await axios.get('https://kmsadmin-production.up.railway.app/api/shifts')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllOperationsByShift(shiftId) {
        try {
            return await axios.get(`https://kmsadmin-production.up.railway.app/api/shifts/${shiftId}/operations`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getSignaturesByOperation(operationId) {
        try {
            return await axios.get(`https://kmsadmin-production.up.railway.app/api/operations/${operationId}/signatures`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
