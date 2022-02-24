const router = require('express').Router();
const { check, param, query, body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const { addExercise } = require('../db/exercises');
const {
  createUser,
  getUserById,
  getAllUsers,
  getUserByUsername,
  getUserWithExercises,
} = require('../db/users');
const {
  formatUnixToStringDate,
  validateUserId,
  userIdRegExp,
  numbersStringRegExp,
  dateSanitizer,
  limitSanitizer,
  dateQueryValidator
} = require('../utils');

/* get all users */
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error while getting all users.' });
  }
});

/* get user by id */
router.get('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;

    if (!validateUserId(_id)) {
      return res
        .status(400)
        .json({ message: `Bad request. Wrong user _id: ${_id}` });
    }

    const user = await getUserById(_id);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with _id ${_id} does not exists.` });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error while getting users.` });
  }
});

// create new user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User ${username} already exists.` });
    }

    const _id = nanoid();
    const user = {
      _id,
      username,
    };

    await createUser(user);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error while creating new user.` });
  }
});

// create new exercise
router.post(
  '/:id/exercises',
  [
    param('id', 'Incorrect user id').matches(userIdRegExp),
    check('description', 'Incorrect description, should be a string').isLength({
      min: 1,
    }),
    check('duration', 'Incorrect duration value, should be string of numbers')
      .matches(numbersStringRegExp)
      .toInt(),
    body('date').customSanitizer((value) => dateSanitizer(value, formatUnixToStringDate(Date.now()))),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Incorrect data.', errors: errors.array() });
      }

      const { id: user_id } = req.params;
      const { description, duration, date } = req.body;

      const exercise = {
        user_id,
        description,
        duration,
        date,
      };

      await addExercise(exercise);
      res.status(201).json(exercise);
    } catch (error) {
      console.log(error);

      // not sure how better to define FOREIGN KEY error
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res
          .status(404)
          .json({ message: 'User in not exists.' });
      }

      return res
        .status(500)
        .json({ message: 'Error while adding new exercise to user.' });
    }
  }
);

router.get(
  '/:id/logs',
  [
    query('from', 'Incorrect from value, user YYYY-MM-DD format.').custom(dateQueryValidator).default(null),
    query('to', 'Incorrect to value, user YYYY-MM-DD format.').custom(dateQueryValidator).default(null),
    query('limit').customSanitizer(limitSanitizer),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Incorrect data.', errors: errors.array()});
      }  
      
      if (!validateUserId(req.params.id)) {
        return res
          .status(404)
          .json({ message: `User with _id ${id} does not exists.` });
      }

      const { from, to, limit } = req.query;

      const raw = await getUserWithExercises(req.params.id, from, to, limit);
      const user = mapUserWithExercises(raw);
      
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Something went wrong while trying to get user logs.`,
      });
    }
  }
);

function mapUserWithExercises(raw) {
  if (!raw.length) {
    return {};
  }

  const { _id, username, count } = raw[0];

  const logs = raw.map(({ description, duration, date }) => {
    return {
      description,
      duration,
      date,
    };
  });

  return {
    _id,
    username,
    logs,
    count,
  };
}

module.exports = router;
