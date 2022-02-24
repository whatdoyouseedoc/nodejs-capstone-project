const db = require('.');

async function addExercise({ user_id, description, duration, date }) {
  const query = `INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(query, [user_id, description, duration, date], (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

module.exports = {
  addExercise,
};
