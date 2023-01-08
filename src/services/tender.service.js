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

exports.GetAllTenders = async (search, category) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Tender WHERE (title LIKE '%${search}%' OR description LIKE '%${search}%') AND category LIKE '%${category}%' ORDER BY updated_at DESC`;
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
            // get my tenders and bid count for each tender
            const sql = `SELECT Tender.*, COUNT(Bids.id) AS bidcount FROM Tender LEFT JOIN Bids ON Tender.id = Bids.tenderid WHERE Tender.companyid = ? GROUP BY Tender.id ORDER BY updated_at DESC`;
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

exports.BidOnTender = async (tenderid, companyid, amount) => {
    if (!tenderid || !companyid || !amount) {
        throw {
            message: 'Missing required fields'
        };
    }
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO Bids (id, tenderid, companyid, amount) VALUES (?, ?, ?, ?)`;
            const id = uuidv4();
            SQL.query(sql, [id, tenderid, companyid, amount], (err, result, fields) => {
                if (err) {
                    if (err.sqlMessage.includes('Duplicate')) {
                        reject('Bid already exists');
                    }
                    console.log(err);
                    reject(err.sqlMessage);
                }
                else resolve({
                    id,
                    tenderid,
                    companyid,
                    amount
                });
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.GetBidsOnTender = async (tenderid, companyid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `   SELECT * 
                            FROM Bids, Company,Tender 
                            WHERE   Bids.tenderid = Tender.id 
                                    AND Bids.companyid = Company.id
                                    AND Bids.tenderid = ?
                                    AND Bids.companyid = ?`;
            SQL.query(sql, [tenderid , companyid], (err, result, fields) => {
                if (err) reject(err.sqlMessage);
                else resolve(result);
            }
            );
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.GetBidCountOnTender = async (tenderid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT COUNT(*) AS count FROM Bids WHERE tenderid = ?`;
            SQL.query(sql, [tenderid], (err, result, fields) => {
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

exports.GetMyBids = async (companyid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Bids, Tender WHERE Bids.tenderid = Tender.id AND Bids.companyid = ? ORDER BY Bids.updated_at DESC`;
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

exports.IsAllowedToBidOnTender = async (tenderid, companyid) => {
    //check if company has already bid on tender. only one bid per company per tender
    return new Promise(async (resolve, reject) => {
        const sql = `SELECT * FROM Bids WHERE tenderid = ? AND companyid = ?`;
        SQL.query(sql, [tenderid, companyid], (err, result, fields) => {
            if (err) reject(err.sqlMessage);
            else resolve(result.length === 0);
        }
        );
    });
}



