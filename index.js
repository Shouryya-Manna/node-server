const express = require("express");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;
const fs = require("fs");

//middleware
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  req.myUserName = "shouryyamanna.dev";
  next();
});

app.use((req, res, next) => {
  console.log("Hello from middleware 2", req.myUserName);
  next();
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});
app.get("/", (req, res) => {
  res.send("Hello from Home Page");
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if(!user){
      return res.status(404).json({msg: "User not found..."});
    }
    return res.json(user);
  })
  .patch((req, res) => {
    //edit the user details
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    //delete user
    return res.json({ status: "pending" });
  });

app.post("/api/users", (req, res) => {
  //create user
  const body = req.body;
  if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title ){
    return res.status(400).json({msg: "All fields are required..."});
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
  console.log("Body", body);
});

app.listen(PORT, () => {
  console.log("Server has started...");
});
