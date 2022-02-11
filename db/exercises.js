const knex = require('./knex');

function addExercise(exercise) {
  return knex('exercises').insert(exercise);
}

module.exports = {
  addExercise
};
