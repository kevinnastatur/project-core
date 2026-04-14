const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      userType: user.role?.userType ?? null,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    },
  )
}

module.exports = {
  generateAccessToken,
}
