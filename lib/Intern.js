// TODO: Write code to define and export the Intern class.  HINT: This class should inherit from Employee.
const Employee = require(`./Employee`);

class Intern extends Employee {
    constructor(name, id, email, school) {
        super(name, id, email);
        this.school = school;
    }
    getSchool() {
        const school = this.school;
        return school;
    }
    getRole(Intern) {
        return `Intern`;
    }
}

module.exports = Intern;