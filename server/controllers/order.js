const DB = require("../models/order");
const OrderItemDB = require("../models/order_item");
const ProductDB = require("../models/product");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let user = req.user;
  let db_order = await DB.find({ user: user._id })
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "product",
      },
    })
    .populate("user");

  if (db_order) {
    Helper.fMsg(res, `${user.name}'s Orders`, db_order);
  } else {
    next(new Error(`No order yet in ${user.name} User`));
  }
};

const add = async (req, res, next) => {
  const user = req.user;
  const items = req.body.items;

  if (items && items[0].product_id && items[0].count) {
    let save_order = new DB();
    let order_items_obj = [];
    let total = 0;
    for await (let item of items) {
      let product = await ProductDB.findById(item.product_id);
      let obj = {
        order: save_order._id,
        count: item.count,
        product: product._id,
      };
      order_items_obj.push(obj);
      total += product.price * item.count;
    }

    let order_items_result = await OrderItemDB.insertMany(order_items_obj);
    let orderItemIds = order_items_result.map((item) => item._id);

    save_order.user = user._id;
    save_order.items = orderItemIds;
    save_order.count = items.length;
    save_order.total = total;

    let result = await save_order.save();
    Helper.fMsg(res, `Order Accepted`, result);
  } else {
    next(new Error("Can't Order without product and count"));
  }
};

// const patch = async (req, res, next) => {
//   let db_order = await DB.findById(req.params.id);
//   if (db_order) {
//     let existOrder = await DB.findOne({ name: req.body.name });
//     if (existOrder) {
//       next(new Error("Order is already exist"));
//     } else {
//       if (req.body.free_pickup_zone) {
//         req.body.free_pickup_zone = req.body.free_pickup_zone
//           .split(",")
//           .map((str) => str.trim());
//       }
//       if (req.body.extra_charge_pickup_zone) {
//         req.body.extra_charge_pickup_zone = req.body.extra_charge_pickup_zone
//           .split(",")
//           .map((str) => str.trim());
//       }
//       await DB.findByIdAndUpdate(db_order._id, req.body);
//       let result = await DB.findById(req.params.id);
//       if (db_order.name === req.body.name) {
//         Helper.fMsg(
//           res,
//           "Nothing changed to Original Order because of the same Order Name",
//           result,
//         );
//       } else {
//         Helper.fMsg(res, "Order Updated", result);
//       }
//     }
//   } else {
//     next(new Error("No Order with that id"));
//   }
// };

// const drop = async (req, res, next) => {
//   let db_order = await DB.findById(req.params.id);
//   if (db_order) {
//     let order = db_order.name;
//     await DB.findByIdAndDelete(db_order._id);
//     Helper.fMsg(res, `${order} Order Deleted`);
//   } else {
//     next(new Error("No Order with that id"));
//   }
// };

module.exports = {
  all,
  add,
  // get,
  // patch,
  // drop,
};
