const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const router = express.Router();
const auth = require('../middleware/auth');

router.post(
  '/',
  [
    check('username', 'The username must not be empty').not().isEmpty(),
    check('name', 'The name must not be empty').not().isEmpty(),
    check('password', 'Password must contain at least 5 characters').isLength({
      min: 5,
    }),
    check('email', 'Enter a valid email').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password, email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: err.message }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const salt = await bcrypt.genSalt(10);

    const userToSave = new User({
      name,
      username,
      password: await bcrypt.hash(password, salt),
      email,
      avatar,
    });

    try {
      await userToSave.save();
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: err.message }] });
    }

    const payload = {
      user: {
        id: userToSave.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: 'Interbal server error: ' + err.message }],
          });
        }
        return res.json({ jwt: token });
      }
    );
  }
);

router.post(
  '/login',
  [
    check('username', 'The username must not be empty').not().isEmpty(),
    check('password', 'Password must not be empty').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    let user = null;
    try {
      user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Wrong username or password' }] });
      }
    } catch (err) {
      return res.status(500).json({ errors: [{ msg: err.message }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Wrong username or password' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: 'Internal server error: ' + err.message }],
          });
        }
        return res.json({ jwt: token });
      }
    );
  }
);

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: 'Interbal server error: ' + err.message }],
    });
  }
});

module.exports = router;
