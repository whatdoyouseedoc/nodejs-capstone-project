const router = require('express').Router();
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
  validateDate,
  resolveDate,
  formatUnixToStringDate,
  validateUserId,
  validateLimit,
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
router.post('/:id/exercises', async (req, res) => {
  try {
    const date = resolveDate(req.body.date);
    const duration = Number(req.body.duration);
    const { description } = req.body;
    const { id: user_id } = req.params;

    const exercise = {
      user_id,
      description,
      duration,
      date,
    };

    if ([user_id, description, duration, date].some((it) => it === undefined || it === '')) {
      res.status(400).json({ message: 'Bad request' });
    }

    await addExercise(exercise);
    res.status(201).json(exercise);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Error while adding new exercise to user.' });
  }
});

router.get('/:id/logs', async (req, res) => {
  try {
    let id,
      limit = null;

    if (validateUserId(req.params.id)) {
      id = req.params.id;
    } else {
      return res
        .status(404)
        .json({ message: `User with _id ${id} does not exists.` });
    }

    if (validateLimit(req.query.limit)) {
      limit = Number(req.query.limit);
    }

    let from = null,
      to = null;

    if (req.query.from && validateDate(req.query.from)) {
      from = new Date(req.query.from).valueOf();
    }

    if (req.query.to && validateDate(req.query.to)) {
      to = new Date(req.query.to).valueOf();
    }

    const raw = await getUserWithExercises(req.params.id, from, to, limit);
    const user = mapUserWithExercises(raw);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Something went wrong while trying to get user logs.`,
    });
  }
});

function mapUserWithExercises(raw) {
  if (!raw.length) {
    return {};
  }

  const { _id, username, count } = raw[0];

  const logs = raw.map(({ description, duration, date }) => {
    return {
      description,
      duration,
      date: formatUnixToStringDate(date),
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
