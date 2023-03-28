// Handles data logic for user-related things
// Interacts with database

const { client } = require('./db');

class User {
    //Method to get all users in db and their info
    static async getAllUsers() {
        try {
            const result = await client.query(`(select first_name, last_name, email from postoffice.CUSTOMER c)
                                                union (select first_name, last_name, email from postoffice.EMPLOYEE e);`);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve all users.');
        }
    }
    //Method to get user by type/role
    static async getUserType(user) {
        try {
            const email = user.email;
            const password = user.password;

            const result = await client.query(`
                SELECT ul.type
                FROM dev_db.postoffice.USER_LOGIN ul
                WHERE ul.username = '${email}' AND ul.password = '${password}';
            `)
            // always returns one item so first index
            return result.recordset[0];

        } catch (err) {
            console.log(err);
            throw new Error('User does not exist.');
        }
    }
    //Method to get user by email
    static async getUserByEmail(email) {
        try {
            const result = await client.query(`Select *
                                            FROM dev_db.postoffice.USER_LOGIN AS ul
                                            WHERE ul.username = '${email}';`);
            return result.recordset;
        } catch (err) {
            throw new Error('Failed to retrieve user logins, check if email is correct.');
        }
    }

    //Method to get all customer data in db
    static async getAllCustomers() {
        try {
            const result = await client.query(`Select * FROM dev_db.postoffice.CUSTOMER;`);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve customers.');
        }
    }

    //Method to get all employee data in db
    static async getAllEmployees() {
        try {
            const result = await client.query(`Select * FROM dev_db.postoffice.EMPLOYEE;`);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve employees.');
        }
    }

    //Method to get all employee data in db
    static async getEmployeesByBranch(address) {
        try {
            const result = await client.query(`Select * FROM dev_db.postoffice.EMPLOYEE AS E
                                                WHERE E.branch_address='${address}';`);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve employees.');
        }
    }

    //Method to get all user logins in db
    static async getAllUserLogins() {
        try {
            const result = await client.query(`Select * FROM dev_db.postoffice.USER_LOGIN;`);
            return result.recordset;
        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve user logins.');
        }
    }

    //Method to post a user's data into the db
    static async createCustomer(data) {
        try {

            const user = JSON.parse(data);
            console.log(user);
            
            //create user login for customer
            const username = user.email;
            const pw = user.password;
            const type = 'customer';
            let result = await client.query(`
                INSERT INTO dev_db.postoffice.USER_LOGIN (username, password, type)
                VALUES ('${username}', '${pw}', '${type}');
            `)
            console.log(`User Login created for ${username}.`);

            //add rest of data to customer table
            const fname = user.first_name;
            const lname = user.last_name;
            const addr = user.home_address;
            result = await client.query(`
                INSERT INTO dev_db.postoffice.CUSTOMER (email, home_address, first_name, last_name)
                VALUES ('${username}', '${addr}', '${fname}', '${lname}');
            `)
            console.log(`Customer ${fname} ${lname} created.`)

            //return post data
            return data;
            
            

        } catch(err) {

            console.log(err);
            throw new Error('Failed to create new user.');
        }
    }
}

module.exports = {
    User,
}