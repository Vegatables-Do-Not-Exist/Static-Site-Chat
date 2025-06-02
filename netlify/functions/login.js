exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username and password required" }),
      };
    }

    const users = JSON.parse(process.env.USERS_JSON);

    if (users[username] && users[username] === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, user: username }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid username or password" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
};
