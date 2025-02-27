const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDBUsers = await User.find({});
  res.json(allDBUsers);
}

async function handleGetUsersById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not found..." });
  }
  return res.json(user);
}

async function handleUpdateUsersById(req, res) {
  await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
  return res.json({ status: "Success" });
}

async function handleDeleteUsersById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ status: "Success" });
}

async function handleCreateUsersById(req, res) {
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

  return res.status(201).json({ msg: "Success", id: result._id });
}

module.exports = {
  handleGetAllUsers,
  handleGetUsersById,
  handleUpdateUsersById,
  handleDeleteUsersById,
  handleCreateUsersById,
};
