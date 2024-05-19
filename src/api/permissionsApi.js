import axios from "axios"

export default class permissionsApi {

    static async createPermission(name) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/permissions', {
                name: name
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async addPermissionToAudience(permissionId, audienceId) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/audiences/${audienceId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deletePermissionFromAudience(permissionId, audienceId) {
        try {
            return await axios.delete(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/audiences/${audienceId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async addPermissionToDivision(permissionId, divisionId) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/divisions/${divisionId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deletePermissionFromDivision(permissionId, divisionId) {
        try {
            return await axios.delete(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/divisions/${divisionId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async addPermissionToEmployee(permissionId, employeeId) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/employees/${employeeId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deletePermissionFromEmployee(permissionId, employeeId) {
        try {
            return await axios.delete(`https://kms2-production.up.railway.app/api/permissions/${permissionId}/employees/${employeeId}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
