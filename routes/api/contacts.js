const express = require("express");

const { contacts: ctrl } = require("../../controllers");
const { contactJoiSchema, favoriteJoiSchema } = require("../../models/contact");
const { validation, ctrlWrapper, auth } = require("../../middlewares");

const router = express.Router();

router.get("/", auth, ctrlWrapper(ctrl.getAll));

router.get("/:contactId", auth, ctrlWrapper(ctrl.getById));

router.post("/add", auth, validation(contactJoiSchema), ctrlWrapper(ctrl.add));

router.delete("/delete/:contactId", auth, ctrlWrapper(ctrl.deleteById));

router.put(
  "/edit/:contactId",
  auth,
  validation(contactJoiSchema),
  ctrlWrapper(ctrl.updateById)
);

router.patch(
  "/:contactId/favorite",
  auth,
  validation(favoriteJoiSchema),
  ctrlWrapper(ctrl.updateFavorite)
);

module.exports = router;
