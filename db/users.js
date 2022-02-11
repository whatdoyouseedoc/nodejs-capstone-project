const { dateToNumber } = require('../utils');
const knex = require('./knex');

function createUser(user) {
  return knex('users').insert(user);
}

function getAllUsers() {
  return knex('users').select('*');
}

/**
 * Get user by _id
 * @param {string} _id user id 
 * @returns {object} {_id: string, username: string}
 */
function getUserById(userId) {
  return knex('users').where({
    _id: userId
  }).first();
}

/**
 * Get user by username
 * @param {string} username 
 * @returns {object} {_id: string, username: string}
 */
function getUserByUsername(username) {
  return knex('users').where({
    username
  }).first();
}

/**
 * Get user and extends with related exercises
 * @param {string} userId user id
 * @param {string} from 
 * @param {string} to 
 * @param {string} limit 
 * @returns 
 */
function getUserWithExercises(userId, from, to, limit) {
  const query =  knex('users').select('*')
  .where({
    _id: userId
  }).innerJoin('exercises', 'users._id', '=', 'exercises.user_id');

  if (from) {
    query.where('date', '>=', from);
  }

  if (to) {
    query.where('date', '<=', to);
  }

  if (limit) {
    query.limit(limit);
  }

  return query;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserWithExercises,
  getUserByUsername
};