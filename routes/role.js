const router = require("express").Router();
const controller = require("../controllers/role");
const { RoleSchema, AllSchema } = require("../utils/schema");
const { validateBody, validateParam } = require("../utils/validator");

router.get("/", controller.all);
router.post("/", [validateBody(RoleSchema.add), controller.add]);
router.post("/addpermit", [
  validateBody(RoleSchema.addPermit),
  controller.addPermit,
]);
router.post(
  "/removepermit",
  validateBody(RoleSchema.removePermit),
  controller.removePermit
);

router
  .route("/:id")
  .get(validateParam(AllSchema.id, "id"), controller.get)
  .patch(validateParam(AllSchema.id, "id"), controller.patch)
  .delete(validateParam(AllSchema.id, "id"), controller.drop);
module.exports = router;
