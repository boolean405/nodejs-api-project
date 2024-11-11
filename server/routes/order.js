const router = require("express").Router();
const controller = require("../controllers/order");
const { OrderSchema, AllSchema } = require("../utils/schema");
const { validateBody } = require("../utils/validator");

router.get("/", controller.all);
router.post("/", controller.add);

// router
//   .route("/:id")
//   .get(validateParam(AllSchema.id, "id"), controller.get)
//   .patch(
//     [
//       validateParam(AllSchema.id, "id"),
//       uploadSingleFile,
//       validateBody(OrderSchema.patch),
//     ],
//     controller.patch,
//   )
//   .delete(validateParam(AllSchema.id, "id"), controller.drop);
module.exports = router;
