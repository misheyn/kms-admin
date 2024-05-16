import axios from "axios"

export default class employeesApi {

    static async createEmployee(firstName, lastName, patronymic, imageId, employeeType) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/employees', {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                image_id: imageId,
                employee_type: employeeType
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async createID(id, number, startDate, endDate) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/employeeIds', {
                number: number,
                start_date: startDate,
                end_date: endDate,
                not_expired: true,
                employee_id: id
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async createImage(photo) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/images',
                photo,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllEmployees() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/employees')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllIDs() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/employeeIds')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getAllImages() {
        try {
            return await axios.get('https://kms2-production.up.railway.app/api/images')
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async getImage(id) {
        try {
            return await axios.get(`https://kms2-production.up.railway.app/api/images/${id}`,{
                responseType: 'blob'
            })
                .then(response => response.data)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateEmployee(id, firstName, lastName, patronymic, imageId, type, status) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employees/${id}`, {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                image_id: imageId,
                employee_type: type,
                employee_status: status
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async updateID(id, employeeId, number, startDate, endDate) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employeeIds/${id}`, {
                number: number,
                start_date: startDate,
                end_date: endDate,
                not_expired: true,
                employee_id: employeeId
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }

    static async deleteImage(id) {
        try {
            return await axios.delete(`https://kms2-production.up.railway.app/api/images/${id}`)
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
