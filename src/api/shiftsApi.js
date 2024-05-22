import axios from "axios"

export default class shiftsApi {

    static async getAllShifts() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/shifts?limit=5')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllOperationsByShift(shiftId) {
        try {
            return await axios.get(`https://kms2-production.up.railway.app/api/shifts/${shiftId}/operations`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getSignaturesByOperation(operationId) {
        try {
            return await axios.get(`https://kms2-production.up.railway.app/api/operations/${operationId}/signatures`)
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
