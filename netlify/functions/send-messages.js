const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, message, category } = JSON.parse(event.body);

  if (!name || !message || !category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name, message, and category are required." }),
    };
  }

  const validCategories = ["Idea", "Problem", "Misc"];
  if (!validCategories.includes(category)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid category." }),
    };
  }

  const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;

  const record = {
    fields: {
      Name: name,
      Message: message,
      Category: category,
    },
  };

  try {
    const res = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const error = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error }),
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, record: data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
