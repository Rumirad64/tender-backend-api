const { v4 } = require('uuid');
const SQL = require('../database/database');
const crypto = require('crypto');
const uuidv4 = v4;

exports.Register = async (email, password, fullname) => {
  if (!email || !password || !fullname) {
    throw {
      message: 'Missing required fields'
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO Users (id, email, fullname, password ) VALUES (?, ?, ?, ?)`;
      const id = uuidv4();
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      SQL.query(sql, [id, email, fullname, hash,], (err, result, fields) => {
        if (err) reject(err.sqlMessage);
        else resolve({
          id,
          email,
          fullname,
        });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

exports.SignIn = async (email, password) => {
  if (!email || !password) {
    throw {
      message: 'Missing required fields'
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM Users WHERE email = ?`;
      SQL.query(sql, [email], async (err, result, fields) => {
        if (err) reject(err.sqlMessage);
        else if (result.length === 0) reject('User not found');
        else {
          const hash = result[0].password;
          const isValid = crypto.createHash('sha256').update(password).digest('hex') === hash;
          if (isValid) {
            resolve({
              id: result[0].id,
              email: result[0].email,
              fullname: result[0].fullname,
            });
          } else {
            reject('Invalid password');
          }
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
};

exports.GetUserByID = async (id) => {
  if (!id) {
    throw {
      message: 'Missing required fields'
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM Users WHERE id LIKE ?`;
      SQL.query(sql, [id], (err, result, fields) => {
        if (err) reject(err.sqlMessage);
        else if (result.length === 0) reject('User not found');
        else resolve(result[0]);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
};

exports.GetAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT id, email, fullname FROM Users`;
      SQL.query(sql, (err, result, fields) => {
        if (err) reject(err.sqlMessage);
        else resolve(result);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
}


exports.DeleteUser = async (idFromMiddleware, id) => {
  if (idFromMiddleware !== id) {
    throw {
      message: 'You are not authorized to delete this user'
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `DELETE FROM Users WHERE id LIKE ?`;
      SQL.query(sql, [idFromMiddleware], (err, result, fields) => {
        if (err) reject(err.sqlMessage);
        else {
          if (result.affectedRows === 0) reject('User not found');
          else resolve('User deleted');
        }
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
};


/* setTimeout(() => {
    console.log('Hello World');
    this.register('test@sdf.lk', '123456', 'fullname bn');
    console.log('Executed');
}, 3000); */
