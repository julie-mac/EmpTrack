INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Legal"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 2),
("Salesperson", 80000, 2),
("Lead Engineer", 150000, 1),
("Software Engineer", 120000, 1),
("Account Manager", 160000, 4),
("Accountant", 125000, 4),
("Legal Team Lead", 250000, 3),
("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Julia", "Jameson", 1, NULL),
("Tamara", "Timmons", 2, 1),
("Erin", "Emerson", 3, NULL),
("Sally", "Smith", 4, 3),
("Barry", "Bunson", 5, NULL),
("Zachary", "Zwicker", 6, 5),
("Daniel", "Duggins", 7, NULL),
("Adam", "Appleson", 8, 7);

