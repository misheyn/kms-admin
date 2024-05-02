import axios from "axios"

export default class employeesApi {

    static async createEmployee(firstName, lastName, patronymic, employeeType) {
        try {
            return await axios.post('https://kms2-production.up.railway.app/api/employees', {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                photo_url: "photo",
                employee_type: employeeType
            })
                .then(response => response.data)
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

    static async deleteEmployee(id, firstName, lastName, patronymic, employeeType) {
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

    static async updateEmployee(id, firstName, lastName, patronymic, employeeType) {
        try {
            return await axios.put(`https://kms2-production.up.railway.app/api/employees/${id}`, {
                first_name: firstName,
                second_name: lastName,
                middle_name: patronymic,
                photo_url: "photo",
                employee_type: employeeType,
                employee_status: "WORKS"
            })
                .then(response => response)
        } catch (error) {
            alert("Error!")
            console.error(error)
        }
    }
}
