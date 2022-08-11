const SQL = require('../database/database');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

exports.CreateCompany = async (name, ownername, address, city, url, tel, type, category) => {
    if (!name || !ownername || !address || !city || !url || !tel || !type || !category) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO Company (id, name, ownername, address, city, url, tel, type, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const id = uuidv4();
            SQL.query(sql, [id, name, ownername, address, city, url, tel, type, category], (err, result, fields) => {
                if (err) {
                    if (err.sqlMessage.includes('Duplicate')) {
                        reject('Company already exists');
                    }
                    console.log(err);
                    reject(err.sqlMessage);
                }
                else resolve({
                    id,
                    name,
                    ownername,
                    address,
                    city,
                    url,
                    tel,
                    type,
                    category,
                });
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

exports.GetAllCompanies = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Company ORDER BY updated_at DESC`;
            SQL.query(sql, (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                else resolve(result);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.AssignCompanyToUser = async (userid, companyid) => {
    if (!userid || !companyid) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO Company_User (userid, companyid) VALUES (?, ?)`;
            console.log(sql);
            SQL.query(sql, [userid, companyid], (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                else resolve({
                    userid,
                    companyid,
                });
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.GetCompanyByUserID = async (userid) => {
    if (!userid) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Company_User WHERE userid = ? LIMIT 1`;
            SQL.query(sql, [userid], (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                else resolve(result[0]?.companyid || null);
            });
        }
        catch (err) {
            console.log(err);
            resolve("");
        }
    })
}

exports.GetCompanyByID = async (id) => {
    if (!id) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Company WHERE id = ? LIMIT 1`;
            SQL.query(sql, [id], (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                else resolve(result[0]);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

