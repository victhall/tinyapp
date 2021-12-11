const { assert } = require('chai');
const { getUserByEmail, generateRandomString, urlsForUser } = require("../helpers.js")


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert(user, expectedOutput);
  });
  it('should return undefined with invalid email', function () {
    const user = getUserByEmail("@example.com", testUsers)
    // const expectedUserID = "userRandomID";
    const expectedOutput = undefined;
    assert.isUndefined(user, expectedOutput);
  });
});


const testUrls = {
  'f4555': {
    longURL: 'https://f45training.ca/vaughanwest/home',
    userId: 'victoria'
  },
  'artzai': {
    longURL: 'https://www.aritzia.com/',
    userId: 'victoria'
  },
  h684Gd: {
    longURL: "http://www.lighthouselabs.ca",
    userId: "aJ48lW"
  }
};
describe('urlsForUser', function () {
  it('should return the corresponding urls for a user', function () {
    const userUrl = urlsForUser('victoria', testUrls);
    const expectedOutput = {
      'f4555': {
        longURL: 'https://f45training.ca/vaughanwest/home',
        userId: 'victoria'
      },
      'artzai': {
        longURL: 'https://www.aritzia.com/',
        userId: 'victoria'
      },
    };
    assert.deepEqual(userUrl, expectedOutput);
  });
  it("should return empty if the user doesn't exist", () => {
    const userUrls = urlsForUser('papa', testUrls);
    assert.deepEqual(userUrls, {});
  });
});