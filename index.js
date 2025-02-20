const express = require("express");
const app = express();
const PORT = 8000;
const fs = require("fs");
const mongoose = require("mongoose");
const { timeStamp } = require("console");

//Connection

mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

//schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    jobTitle: {
      type: String,
    },

    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

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

app.get("/users", async(req, res) => {
  const allDBUsers = await User.find({});
  const html = `
    <ul>
    ${allDBUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/api/users", async(req, res) => {
  const allDBUsers = await User.find({});

  res.setHeader("X-MyName","Shouryya Manna");

  res.json(allDBUsers);
});
app.get("/", (req, res) => {
  res.send("Hello from Home Page");
});

app
  .route("/api/users/:id")
  .get(async(req, res) => {
    const user = await User.findById(req.params.id);
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ msg: "User not found..." });
    }
    return res.json(user);
  })
  .patch(async(req, res) => {
    //edit the user details
    await User.findByIdAndUpdate(req.params.id,{lastName: "Changed"});
    return res.json({ status: "Success" });
  })
  .delete(async(req, res) => {
    //delete user
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
  });

app.post("/api/users", async (req, res) => {
  //create user
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  )
    return res.status(400).json({ msg: "All fields are required..." });

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  console.log("Result", result);

  return res.status(201).json({ msg: "Success" });
  // users.push({ ...body, id: users.length + 1 });
  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).json({ status: "success", id: users.length });
  // });
  console.log("Body", body);
});

app.listen(PORT, () => {
  console.log("Server has started...");
});
