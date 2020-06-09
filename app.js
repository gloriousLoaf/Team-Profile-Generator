// Required packages
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const fs = require("fs");

// haven't been put to use yet
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

// in case I use similar file writing process as Team Generator:
// const writeFileAsync = util.promisify(fs.writeFile);


// theTeam[] will be an array of objects filled by teamInquirer()
const theTeam = [];

/* every team has a Manager, manager() prompts user
    through creation and calls employeeInquirer() */
const manager = () => {
    return inquirer.prompt([
        {
            type: `input`,
            name: `managerName`,
            message: `Enter the name of the team manager:`,

        },
        {
            type: `input`,
            name: `managerId`,
            message: `Enter manager ID:`,

        },
        {
            type: `input`,
            name: `managerEmail`,
            message: `Enter manager email:`,

        },
        {
            type: `input`,
            name: `managerOffice`,
            message: `Enter manager office number:`,

        },
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

        },
        {
            type: `input`,
            name: `employeeId`,
            message: `Enter employee ID:`,

        },
        {
            type: `input`,
            name: `employeeEmail`,
            message: `Enter employee email:`,

        },
        // logic based on the type of employee we're adding:
        // engineers need GH handle
        {
            when: answers => answers.employeeRole === `Engineer`,
            type: `input`,
            name: `github`,
            message: `Enter their GitHub Username (no @):`,

        },
        // interns need a school
        {
            when: answers => answers.employeeRole === "Intern",
            type: "input",
            name: "school",
            message: "Where do they go to school?",

        },
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
            console.log(theTeam);
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
        console.log(filterEmployees);
        /* user chooses `no` but doesn't have any
            engineers, call employeeInquirer() */
        if (response.addEmployees === "no" && filterEmployees.length == 0) {
            console.log(`Your team needs at least one engineer.`);
            employeeInquirer();
        }
        else if (response.addEmployees === "yes") {
            employeeInquirer();
        }
        // // call function that writes files
        else {
            // placeholder
            console.log(theTeam);
        }
    });
}

manager();