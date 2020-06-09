// Engineer subclass extends Employee
const Employee = require(`./Employee`);

class Engineer extends Employee {
    constructor(name, id, email, github) {
        super(name, id, email);
        this.github = github;
    }
    getGithub() {
        const github = this.github;
        return github;
    }
    getRole(Engineer) {
        return `Engineer`;
    }
}

module.exports = Engineer;