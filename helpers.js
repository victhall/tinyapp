// const bcrypt = require('bcryptjs')

// const plainText = 'password'

// bcrypt.genSalt(10, (err, salt) => {
//   console.log('async salt:', salt)
//   bcrypt.hash(plainText, salt, (err, hash) =>
//   console.log('hashed password: ', hash))
// })


// const salt = bcrypt.genSaltSync(10)
// console.log('sync salt: ', salt)
// const hash = bcrypt.hashSync(plainText, salt)
// console.log('hash sync: ', hash)

// bcrypt.compare('password', hash, (err, success) => {
//   console.log('are these the same: ', success)
// })

// const success = bcrypt.compareSync('password', hash);


//Random string generator
const generateRandomString = function () {
  let newStr = Math.random().toString(36).slice(2, 8);
  return newStr;
};

module.exports = { generateRandomString };
