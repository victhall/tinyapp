const generateRandomString = function () {
  let newStr = Math.random().toString(36).slice(2, 8);
  return newStr;
};

const urlsForUser = function(id, urlDatabase) {
let filtered = {};
for (const shortURL in urlDatabase) {
  if (database[shortURL].userId === id) {
     filtered[shortURL] = urlDatabase[shortURL];
  }
}
};

const getUserByEmail = function(email, database) {
  // lookup magic...
  return user;
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };
