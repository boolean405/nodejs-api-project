const router = require("express").Router();
const controller = require("../controllers/product");
const { ProductSchema, AllSchema } = require("../utils/schema");
const {
  validateBody,
  validateParam,
  validateToken,
  hasAnyRole,
} = require("../utils/validator");
const { uploadMultipleFile } = require("../utils/gallery");

router.post("/", [
  validateToken(),
  hasAnyRole(["Owner", "Admin"]),
  // uploadMultipleFile,
  validateBody(ProductSchema.add),
  controller.add,
]);
router.get("/paginate/:page", controller.all);
router.get("/paginate/:type/:id/:page", controller.filterBy);

router
  .route("/:id")
  .get(validateParam(AllSchema.id, "id"), controller.get)
  .patch(
    [
      validateToken(),
      hasAnyRole(["Owner", "Admin"]),
      validateParam(AllSchema.id, "id"),
      uploadMultipleFile,
      validateBody(ProductSchema.patch),
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
