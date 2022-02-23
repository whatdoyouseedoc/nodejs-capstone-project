const db = require(".");

async function createUser({_id, username}) {
  const query = `INSERT INTO users (_id, username) VALUES (?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(query, [_id, username], (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

async function getAllUsers() {
  const query = `SELECT * FROM users`;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      }

      resolve(rows);
    });
  });
}

/**
 * Get user by _id
 * @param {string} _id user id 
 * @returns {promise} {_id: string, username: string}
 */
async function getUserById(id) {
  const query = `SELECT * FROM users WHERE _id = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, rows) => {
      if (err) {
        reject(err);
      }
  
      resolve(rows);
    });
  });
}

/**
 * Get user by username
 * @param {string} username 
 * @returns {promise} {_id: string, username: string}
 */
async function getUserByUsername(username) {
  const query = `SELECT * FROM users WHERE username = ?`;

  return new Promise((resolve, reject) => {
    db.get(query, [username], (err, row) => {
      if (err) {
        reject(err);
      }
  
      resolve(row);
    });
  });
}

/**
 * Get user and extends with related exercises
 * @param {string} userId user id
 * @param {string} from 
 * @param {string} to 
 * @param {string} limit 
 * @returns {promise} {username: string, count: number, logs: [description: string, duration: number, date: number]}
 */
async function getUserWithExercises(userId, from, to, limit)  {
  const params = [userId, userId, from, to, limit].filter(it => it !== null);

  const query = `
    SELECT username, description, duration, date,
      (SELECT COUNT(user_id) FROM exercises WHERE user_id = ?) AS count
    FROM users
    JOIN exercises ON exercises.user_id = users._id
    WHERE _id = ?
    ${from !== null ? ' AND date >= ?' : ''}
    ${to !== null ? ' AND date <= ?' : ''}
    ${limit !== null ? ' LIMIT ?' : ''}
  `;

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      }
  
      resolve(rows);
    });
  });
}

module.exports = {
  getUserById,
  createUser,
  getAllUsers,
  getUserByUsername,
  getUserWithExercises
};