const { v4: uuidv4 } = require('uuid'); const SQL = require('../database/database');
const crypto = require('crypto');

const company_service = require('./company.service');
const user_service = require('./user.service');


exports.CreateTender = async (title, description, category, location, expirydate, companyid, image, document) => {
    if (!title || !description || !category || !location || !expirydate || !companyid) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO Tender (id, ref, title, description, category, location, expirydate, companyid, image, document) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const id = uuidv4();
            //generate capitalized 7 character random string,
            const ref = Math.random().toString(36).substr(2, 7).toUpperCase();
            SQL.query(sql, [id, ref, title, description, category, location, expirydate, companyid, image, document], (err, result, fields) => {
                if (err) {
                    if (err.sqlMessage.includes('Duplicate')) {
                        reject('Tender already exists');
                    }
                    console.log(err);
                    reject(err.sqlMessage);
                }
                else resolve({
                    id,
                    ref,
                    title,
                    description,
                    category,
                    location,
                    expirydate,
                    companyid,
                    image,
                    document,
                });
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.GetAllTenders = async (search) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Tender WHERE title LIKE '%${search}%' ORDER BY updated_at DESC `;
            console.log(sql);
            SQL.query(sql, (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                const res = result.map(async (tender) => {
                    const company = await company_service.GetCompanyByID(tender.companyid);
                    return {
                        ...tender,
                        company
                    };
                });
                Promise.all(res).then(values => {
                    resolve(values);
                }).catch(err => {
                    reject(err);
                });
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.GetTenderByID = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Tender WHERE id = ?`;
            SQL.query(sql, [id], (err, result, fields) => {
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



exports.GetMyTenders = async (companyid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Tender WHERE companyid = ?`;
            SQL.query(sql, [companyid], (err, result, fields) => {
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


exports.DeleteTender = async (companyid, tenderid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM Tender WHERE companyid = ? AND id = ?`;
            SQL.query(sql, [companyid, tenderid], (err, result, fields) => {
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
