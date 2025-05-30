const router = require("express").Router();
const controller = require("../controllers/sub_category");
const { SubCategorySchema, AllSchema } = require("../utils/schema");
const {
  validateBody,
  validateParam,
  validateToken,
  hasAnyRole
} = require("../utils/validator");
const { uploadSingleFile } = require("../utils/gallery");

router.get("/", controller.all);
router.post(
  "/",
  [
    validateToken(),
    hasAnyRole(["Owner", "Admin"]),
    uploadSingleFile,
    validateBody(SubCategorySchema.add),
  ],
  controller.add
);

router
  .route("/:id")
  .get(validateParam(AllSchema.id, "id"), controller.get)
  .patch(
    [
      validateToken(),
      hasAnyRole(["Owner", "Admin"]),
      validateParam(AllSchema.id, "id"),
      uploadSingleFile,
      validateBody(SubCategorySchema.patch),
    ],
    controller.patch
  )
  .delete(
    [
      validateToken(),
      hasAnyRole(["Owner", "Admin"]),
      validateParam(AllSchema.id, "id"),
    ],
    controller.drop
  );
module.exports = router;
