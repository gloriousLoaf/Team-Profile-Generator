// Manager subclass extends Employee
const Employee = require(`./Employee`);

class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }
    getOfficeNumber() {
        const number = this.officeNumber;
        return number;
    }
    getRole(Manager) {
        return `Manager`;
    }
}

module.exports = Manager;