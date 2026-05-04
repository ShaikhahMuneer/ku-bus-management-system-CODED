const express = require("express");
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne
} = require("../controllers/crudFactory");

const createCrudRouter = (Model, populateOptions = []) => {
  const router = express.Router();

  router.route("/")
    .get(getAll(Model, populateOptions))
    .post(createOne(Model));

  router.route("/:id")
    .get(getOne(Model, populateOptions))
    .patch(updateOne(Model))
    .delete(deleteOne(Model));

  return router;
};

module.exports = createCrudRouter;
