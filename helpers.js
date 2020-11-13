// Helper functions 

// Function being tested by mocha + chai
const getUserByEmail = (userEmail, database) => {
  const userVals = Object.values(database);
  for (let i = 0; i < userVals.length; i++) {
    if (userVals[i].email === userEmail) {
      return userVals[i].id;
    }
  }
};

// Returns list of emails in userDatabase
const emailsInDatabase = (userDatabase) => {
  const userVals = Object.values(userDatabase);
  for (let i = 0; i < userVals.length; i++) {
    return userVals[i].email;
  }
};

module.exports = { getUserByEmail };
module.exports = { emailsInDatabase };

