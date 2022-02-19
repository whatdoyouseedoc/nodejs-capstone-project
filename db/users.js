const db = require(".");

async function createUser({_id, username}) {
  const query = `INSERT INTO users (_id, username) VALUES ('${_id}', '${username}')`;

  return new Promise((resolve, reject) => {
    db.run(query, [], (err) => {
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
  const query = `SELECT * FROM users WHERE _id = '${id}'`;

  return new Promise((resolve, reject) => {
    db.get(query, [], (err, rows) => {
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
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  return new Promise((resolve, reject) => {
    db.get(query, [], (err, row) => {
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
  const query = `
    SELECT username, description, duration, date,
      (SELECT COUNT(user_id) FROM exercises WHERE user_id = '${userId}') AS count
    FROM users
    JOIN exercises ON exercises.user_id = users._id
    WHERE date >= ${from} AND date <= ${to} AND _id = '${userId}'
    LIMIT ${limit}
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
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