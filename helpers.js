const generateRandomString = function () {
  let newStr = Math.random().toString(36).slice(2, 8);
  return newStr;
};

const urlsForUser = function (id, urlDatabase) {
  const filtered = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === id) {
      filtered[shortURL] = urlDatabase[shortURL];
    }
  }
  console.log(filtered)
  return filtered;
};

const getUserByEmail = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return false;
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };
