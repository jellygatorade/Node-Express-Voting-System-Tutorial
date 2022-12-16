const express = require("express");
const fs = require("fs").promises; // read and write methods retrieved in the promise implementation
const path = require("path");

const app = express();
const dataFile = path.join(__dirname, "data.json");

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Response to GET request at the ./poll endpoint
app.get("/poll", async (req, res) => {
  //res.send("hello"); // original test

  let data = JSON.parse(await fs.readFile(dataFile, "utf-8"));

  // Calculate total votes from the data.json vote tallies
  //
  // Object.values(data) returns an array of values
  //
  const totalVotes = Object.values(data).reduce((total, n) => (total += n), 0);

  data = Object.entries(data).map(([label, votes]) => {
    return {
      label,
      percentage: ((100 * votes) / totalVotes || 0).toFixed(0), // or zero prevent divide by zero errors, .toFixed(0) converts to whole number
    };
  });

  res.json(data);

  //console.log(totalVotes);
});

//
app.post("/poll", async (req, res) => {
  const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));

  data[req.body.add]++; // req.body represents the user's input

  console.log(req.body);

  await fs.writeFile(dataFile, JSON.stringify(data));

  res.end();
});

app.listen(3000, () => console.log("server is running..."));
