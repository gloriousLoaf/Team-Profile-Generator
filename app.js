// Required packages
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");


// theTeam[] will be an array of objects filled by teamInquirer()
const theTeam = [];

// Two functions to validate user input: validate() and emailValidator()
// validate() makes sure that the user does not provide blank answers
const validator = (val) => {
    if (val !== ``) {
        return true;
    }
}

// emailValidator() validates... emails
const emailValidator = (val) => {
    if (val === ``) {
        return false;
    }
    // Not blank? let's validate the syntax:
    else {
        /* RegExp defining an email as nonblankspaces+@+.+nonblankspaces
            thanks top post by https://stackoverflow.com/users/270821/c-lee */
        const email = /\S+@\S+\.\S+/;
        let realEmail = email.test(val);
        if (realEmail) {
            return true;
        }
    }
}

/* every team has a Manager, manager() prompts user
    through creation and calls employeeInquirer() */
const manager = () => {
    return inquirer.prompt([
        {
            type: `input`,
            name: `managerName`,
            message: `Enter the name of the team manager:`,
            validate: validator
        },
        {
            type: `input`,
            name: `managerId`,
            message: `Enter manager ID:`,
            validate: validator
        },
        {
            type: `input`,
            name: `managerEmail`,
            message: `Enter manager email:`,
            validate: emailValidator
        },
        {
            type: `input`,
            name: `managerOffice`,
            message: `Enter manager office number:`,
            validate: validator
        }
    ])
        // with this data, build a new Manager obj and push to theTeam[]
        .then(response => {
            theTeam.push(new Manager(response.managerName, response.managerId,
                response.managerEmail, response.managerOffice));
            // call employeeInquirer() to continue building team
            employeeInquirer();
        })
}

// employeeInquire() walks user through adding an employee
const employeeInquirer = () => {
    return inquirer.prompt([
        // first it gathers the generic info
        {
            type: "list",
            name: "employeeRole",
            message: "Add a team member:",
            choices: () => {
                return ["Engineer", "Intern"];
            }
        },
        {
            type: `input`,
            name: `employeeName`,
            message: `Enter the employee's name:`,
            validate: validator
        },
        {
            type: `input`,
            name: `employeeId`,
            message: `Enter employee ID:`,
            validate: validator
        },
        {
            type: `input`,
            name: `employeeEmail`,
            message: `Enter employee email:`,
            validate: emailValidator
        },
        // logic based on the type of employee we're adding:
        // engineers need GH handle
        {
            when: answers => answers.employeeRole === `Engineer`,
            type: `input`,
            name: `github`,
            message: `Enter their GitHub Username (no @):`,
            validate: validator
        },
        // interns need a school
        {
            when: answers => answers.employeeRole === "Intern",
            type: "input",
            name: "school",
            message: "Where do they go to school?",
            validate: validator
        }
    ])
        /* logic to build correct new team member
            objects and push them to theTeam[] */
        .then(response => {
            // if Role is Engineer, else if role is Intern:
            if (response.employeeRole === `Engineer`) {
                theTeam.push(new Engineer(response.employeeName, response.employeeId,
                    response.employeeEmail, response.github))
            }
            else if (response.employeeRole === `Intern`) {
                theTeam.push(new Intern(response.employeeName, response.employeeId,
                    response.employeeEmail, response.school))
            }
            // see below
            addEmployees();
        })
}

// addEmployees() allows user to build team with at least 1 engineer
const addEmployees = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "addEmployees",
            message: "Add another employee?",
            choices: ["Yes", "No"]
        }
    ]).then(response => {
        // new array from theTeam[] of only Engineers
        const filterEmployees = theTeam.filter(job => job.github);
        /* user chooses `No` but doesn't have any
            engineers, call employeeInquirer() */
        if (response.addEmployees === "No" && filterEmployees.length == 0) {
            console.log(`Your team needs at least one engineer.`);
            employeeInquirer();
        }
        else if (response.addEmployees === "Yes") {
            employeeInquirer();
        }
        // call function that writes files
        else {
            fileWriter();
        }
    });
}

const fileWriter = () => {
    if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output");
    }
    fs.writeFile(outputPath, render(theTeam), error => {
        if (error) throw error;
        console.log("Created team.html successfully!");
    });
};

// fire it
manager();