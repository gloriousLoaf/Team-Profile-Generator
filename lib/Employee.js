// Employee class to be extended by Manager, Engineer & Intern subclasses
class Employee {
    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;
    }
    getName() {
        const name = this.name;
        return name;
    }
    getId() {
        const id = this.id;
        return id;
    }
    getEmail() {
        const email = this.email;
        return email;
    }
    getRole(Employee) {
        return `Employee`;
    }
}
module.exports = Employee;