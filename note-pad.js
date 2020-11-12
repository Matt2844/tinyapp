

// building function to access emails in db

const fakeDatabase = {
  "Matt": {
    id: "abc123",
    email: "matt@example.com",
    password: "1234",
  },
  "abcd5": {
    id: "xyz123",
    email: "joe@example.com",
    password: "9876",
  }
}

const emailsInDatabase = (database) => {
  const userVals = Object.values(database);
  for (let i = 0; i < userVals.length; i++) {
    console.log(userVals[i].email);
  }
}

// emailsInDatabase(fakeDatabase);

// building function that return email and password

const userEmailPassword = (database) => {
  const userVals = Object.values(database);
  for (let i = 0; i < userVals.length; i++) {
    console.log(userVals[i].email, userVals[i].password);
  }
}

userEmailPassword(fakeDatabase)
