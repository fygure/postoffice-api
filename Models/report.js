const { client } = require('./db');

class Report {
    static async getEmployeeReport(filter) {
        try {
            console.log(filter)
            const newFilter = JSON.parse(filter);
            console.log(newFilter); // Fixme remove printout before prod

            const start_date = newFilter.start_date;
            const end_date = newFilter.end_date;

            const report = await client.query(`
            SELECT first_name, last_name, work_name, pay, hours_worked, on_date, branch_address, phone_number, email, start_date, is_employed
            FROM postoffice.EMPLOYEE e
            INNER JOIN postoffice.JOB_HISTORY jh ON jh.employee_email = e.email
            WHERE on_date BETWEEN '${start_date}' AND '${end_date}';`
            );

            const summary = await client.query(`
            SELECT COUNT(DISTINCT e.email) AS employee_count, SUM(jh.pay) AS total_pay, SUM(hours_worked) AS total_hrs, COUNT(jh.work_id) AS total_job
            FROM postoffice.EMPLOYEE e, postoffice.JOB_HISTORY jh 
            WHERE jh.employee_email = e.email AND jh.on_date BETWEEN '${start_date}' AND '${end_date}';`
            );

            const result = report.recordset.concat(summary.recordset);
            console.log(result);
            return result;

        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve shipment report.');
        }
    }


    static async getShipmentReport(filter) {
        try {
            console.log(filter)
            const newFilter = JSON.parse(filter);
            console.log(newFilter); // Fixme remove printout before prod

            const start_date = newFilter.start_date;
            const end_date = newFilter.end_date;

            const report = await client.query(`
            SELECT tracking_id, c.last_name, c.email, s.current_location, s.shipment_status, s.num_packages, s.region, s.creation_date, t.est_delivery_date 
            FROM postoffice.SHIPMENT AS s
            INNER JOIN postoffice.TRACKS AS t ON t.shipment_tracking_id=s.tracking_id
            INNER JOIN postoffice.CUSTOMER AS c ON c.email = t.customer_email
            WHERE creation_date BETWEEN '${start_date}' AND '${end_date}';`
            );

            const summary = await client.query(`
            SELECT COUNT(DISTINCT t.shipment_tracking_id) AS total_shipment, COUNT(DISTINCT t.customer_email) AS total_customer, SUM(s.num_packages) AS total_packages
            FROM postoffice.SHIPMENT AS s, postoffice.TRACKS AS t
            WHERE t.shipment_tracking_id=s.tracking_id AND s.creation_date BETWEEN '${start_date}' AND '${end_date}';`
            );

            const result = report.recordset.concat(summary.recordset);
            console.log(result);
            return result;

        } catch (err) {
            console.log(err);
            throw new Error('Failed to retrieve shipment report.');
        }
    }
}

module.exports = {
    Report,
}
