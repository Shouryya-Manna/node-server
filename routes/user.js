const express = require("express");
const {
  handleGetAllUsers,
  handleGetUsersById,
  handleUpdateUsersById,
  handleDeleteUsersById,
  handleCreateUsersById,
} = require("../controllers/user");
const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateUsersById);

router
  .route("/:id")
  .get(handleGetUsersById)
  .patch(handleUpdateUsersById)
  .delete(handleDeleteUsersById);

module.exports = router;
