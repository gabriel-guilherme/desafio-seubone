const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.generateToken = generateToken;
