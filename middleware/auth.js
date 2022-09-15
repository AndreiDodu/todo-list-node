const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'Token not found' }] });
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    console.log('FRONTEND SENT: ', decoded);
    next();
  } catch (err) {
    res.status(401).json({ errors: [{ msg: 'Token is invalid' }] });
  }
};
