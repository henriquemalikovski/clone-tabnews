import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
          SELECT
            *
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT 
            1
          ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        name: "NotFoundError",
        message: "The username provided was not found.",
        action: "Please check the username and try again.",
      });
    }

    return result.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `
          SELECT
            email
          FROM
            users
          WHERE
            LOWER(email) = LOWER($1)
          ;`,
      values: [email],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email already exists",
        action: "Please use a different email to create a new user.",
        statusCode: 400,
      });
    }
  }

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: `
          SELECT
            username
          FROM
            users
          WHERE
            LOWER(username) = LOWER($1)
          ;`,
      values: [username],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username already exists",
        action: "Please use a different username to create a new user.",
        statusCode: 400,
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
          INSERT INTO 
            users (username, email, password) 
          VALUES 
            ($1,$2,$3)
          RETURNING
            *
          ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return result.rows[0];
  }
}

const user = {
  create,
  findOneUsername,
};

export default user;
