const inquirer = require('inquirer');
const db = require('./db/connection');

//Empty arrays for roles employee and department data which we'll populate in the start() function
let roles = [];
let employees = [];
let departments = [];

const PORT = process.env.PORT || 3001;

//Connects to MySQL database
db.connect((err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Connected to database");
});

//Populates the above arrays with roles, employees and departments so we can fetch them later in the functions
function start() {
  db.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    roles = res;

    db.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      employees = res; 

      db.query('SELECT * from department', (err, res) => {
        if (err) throw err;
        departments = res;
        console.log(departments);
        browseDatabase();
      });
    });
  });
}

//Main prompts for users
function browseDatabase() {
    inquirer
      .prompt({
        name: 'option',
        type: 'list',
        message: 'Welcome to the Employee Database! What would you like to do?',
        choices: [
            'View All Employees', 
            'Add Employee', 
            'Update Employee Role', 
            'View All Roles', 
            'Add Role', 
            'View All Departments', 
            'Add Department', 
            'Quit'
        ]
    }).then((chosen) => {
        switch(chosen.option) {
            case 'View All Employees': 
              viewEmployees();
              break;   
            case 'Add Employee':  
              addEmployee(); 
              break;
            case 'Update Employee Role':
              updateEmployeeRole();
              break;
            case 'View All Departments':
              viewDepartments(); 
              break;
            case 'Add Department':
              addDepartment(); 
              break;
            case 'View All Roles':
              viewRoles();
              break;
            case 'Add Role':
              addRole();
              break;
            case 'Quit':
              console.log('Have a great day! Good bye!')
              db.end();
              break;
            };
            

    });
}

//Functions for queries

//Function to view all departments
function viewDepartments() {
  db.query(
    `SELECT id, name
    FROM department`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      browseDatabase();
    });
}

//Function to view all roles
function viewRoles() { 
  db.query(
    `SELECT 
    r.id AS role_id,
    r.title AS job_title,
    d.name AS department,
    r.salary
    FROM role AS r
    LEFT JOIN department AS d ON r.department_id = d.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      browseDatabase();
    });
}

//Function to view all employee data
function viewEmployees() {
    db.query(
        `SELECT e.id AS employee_id,
        e.first_name,
        e.last_name,
        r.title AS job_title,
        d.name AS department,
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
        employee AS e
        LEFT JOIN 
        role AS r ON e.role_id = r.id
        LEFT JOIN 
        department AS d ON r.department_id = d.id
        LEFT JOIN 
        employee AS m ON e.manager_id = m.id;`,
        (err, res) => {
          if (err) throw err;
          console.table(res);
          browseDatabase();
        });
};

//Function to add a new employee to database
function addEmployee() {
    inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:",
          },
          {
            name: "role",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => role.title),
          },
          {
            name: "manager",
            type: "list",
            message: "Select the employee's manager:",
            choices: [
              "None",
              ...employees.map(
                (employee) => `${employee.first_name} ${employee.last_name}`
              ),
            ],
          },
        ]).then((choices) => {
            const selectedRole = roles.find(
                (role) => role.title === choices.role
              );
    
              let managerId = null;
              if (choices.manager !== "None") {
                const chosenManager = employees.find(
                  (employee) =>
                    `${employee.first_name} ${employee.last_name}` ===
                    choices.manager
                );
                managerId = chosenManager.id;
              }
    
              db.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: choices.firstName,
                  last_name: choices.lastName,
                  role_id: selectedRole.id,
                  manager_id: managerId,
                },
                (err) => {
                  if (err) throw err;
                  console.log("New Employee Has Been Added!");
                  browseDatabase();
                }
              );
        })
}

//Function to update an employee's role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Please select the employee you wish to update:",
        choices: employees.map(
          (employee) => `${employee.first_name} ${employee.last_name}`
        )
      },
      {
        name: "newRole",
        type: "list",
        message: "Select the new role for the employee:",
        choices: roles.map((role) => role.title),
      },
    ])
    .then((choices) => {
      const selectedEmployee = employees.find((employee) =>
      `${employee.first_name} ${employee.last_name}` ===
      choices.employee
      )

      const selectedRole = roles.find((role) => role.title === choices.newRole);

      db.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [selectedRole.id, selectedEmployee.id],
        (err, result) => {
          console.log("Employee's role has been updated successfully!");
          browseDatabase();
        }
      );
    });
}

//Function to add a new department to database
function addDepartment() {
  inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "Enter the new department's name:",
        },
      ]).then((choices) => {
        db.query(
          "INSERT INTO department SET ?",
            {
              name: choices.name,
            },
            (err) => {
              if (err) throw err;
              console.log("New Role Has Been Added!");
              browseDatabase();
            }
          );
      })
}

//Function to add a new role to database
function addRole() {
  inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the new role's title:",
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter the role's salary:",
        },
        {
          name: "department",
          type: "list",
          message: "Select the role's associated department:",
          choices: departments.map((department) => (department.name)),
        },
      ]).then((choices) => {
          const selectedDepartment = departments.find(
              (department) => department.name === choices.department
            );
          
          const parsedSalary = parseFloat(choices.salary);
  
           db.query(
              "INSERT INTO role SET ?",
              {
                title: choices.title,
                salary: parsedSalary,
                department_id: selectedDepartment.id
              },
              (err) => {
                if (err) throw err;
                console.log("New Role Has Been Added!");
                browseDatabase();
              }
            );
      })
}

//Starts the prompts when you node it!
start();