const DB = require("../models/product");
const CategoryDB = require("../models/category");
const SubCategoryDB = require("../models/sub_category");
const ChildCategoryDB = require("../models/child_category");
const TagDB = require("../models/tag");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  let page_num = Number(req.params.page);
  let limit = Number(process.env.PAGE_LIMIT);

  let req_page = page_num == 1 ? 0 : page_num - 1;
  if (page_num > 0) {
    let skip_count = limit * req_page;
    let result = await DB.find()
      .skip(skip_count)
      .limit(limit)
      .populate("category sub_category tags");
    Helper.fMsg(
      res,
      `All Products Paginated Page Number ${page_num}, for ${limit} limited Products`,
      result
    );
  } else {
    next(new Error(`Page Number must be greater than 0`));
  }
};

const get = async (req, res, next) => {
  let db_product = await DB.findById(req.params.id).populate(
    "category sub_category tags"
  );
  if (db_product) {
    Helper.fMsg(res, "Single Product", db_product);
  } else {
    next(new Error("No Product with that id"));
  }
};

const add = async (req, res, next) => {
  let db_product = await DB.findOne({ name: req.body.name });
  if (db_product) {
    next(new Error("Product is already exist"));
  } else {
    if (req.body.tags) req.body.tags = Helper.splitTrim(req.body.tags);

    if (req.body.recommended)
      req.body.recommended = Helper.splitTrim(req.body.recommended);

    if (req.body.not_recommended)
      req.body.not_recommended = Helper.splitTrim(req.body.not_recommended);

    if (req.body.highlights)
      req.body.highlights = Helper.splitTrim(req.body.highlights);

    if (req.body.included)
      req.body.included = Helper.splitTrim(req.body.included);

    if (req.body.excluded)
      req.body.excluded = Helper.splitTrim(req.body.excluded);

    if (req.body.to_bring)
      req.body.to_bring = Helper.splitTrim(req.body.to_bring);

    if (req.body.destinations)
      req.body.destinations = Helper.splitTrim(req.body.destinations);

    if (req.body.expect_detail)
      req.body.expect_detail = Helper.splitTrim(req.body.expect_detail);

    let result = await new DB(req.body).save();
    Helper.fMsg(res, "Product Saved", result);
  }
};

const patch = async (req, res, next) => {
  let db_product = await DB.findById(req.params.id);
  if (db_product) {
    let exist_product = await DB.findOne({ name: req.body.name });
    if (exist_product) {
      next(new Error("Product is already exist"));
    } else {
      await DB.findByIdAndUpdate(db_product._id, req.body);
      let result = await DB.findById(req.params.id);
      Helper.fMsg(res, "Product Updated", result);
    }
  } else {
    next(new Error("No Product with that id"));
  }
};

// const patch = async (req, res, next) => {
//   let db_product = await DB.findById(req.params.id);
//   if (db_product) {
//     let exist_product = await DB.findOne({ name: req.body.name });
//     if (exist_product) {
//       next(new Error("Product is already exist"));
//     } else {
//       if (req.body.recommended)
//         req.body.recommended = Helper.splitTrim(req.body.recommended);

//       if (req.body.not_recommended)
//         req.body.not_recommended = Helper.splitTrim(req.body.not_recommended);

//       if (req.body.highlights)
//         req.body.highlights = Helper.splitTrim(req.body.highlights);

//       if (req.body.included)
//         req.body.included = Helper.splitTrim(req.body.included);

//       if (req.body.excluded)
//         req.body.excluded = Helper.splitTrim(req.body.excluded);

//       if (req.body.to_bring)
//         req.body.to_bring = Helper.splitTrim(req.body.to_bring);

//       if (req.body.destinations)
//         req.body.destinations = Helper.splitTrim(req.body.destinations);

//       if (req.body.expect_detail)
//         req.body.expect_detail = Helper.splitTrim(req.body.expect_detail);

//       await DB.findByIdAndUpdate(db_product._id, req.body);
//       let result = await DB.findById(req.params.id);
//       Helper.fMsg(res, "Product Updated", result);
//     }
//   } else {
//     next(new Error("No Product with that id"));
//   }
// };

const drop = async (req, res, next) => {
  let db_product = await DB.findById(req.params.id);
  if (db_product) {
    await DB.findByIdAndDelete(db_product._id);
    Helper.fMsg(res, `${db_product.name} Product Deleted`);
  } else {
    next(new Error("No Product with that id"));
  }
};

const filterBy = async (req, res, next) => {
  let type = req.params.type;
  let type_id = req.params.id;
  let page_num = Number(req.params.page);
  const limit = Number(process.env.PAGE_LIMIT);

  const req_page = page_num == 1 ? 0 : page_num - 1;
  if (page_num > 0) {
    const skip_count = limit * req_page;

    let filter_type = "";
    let db_filter_by_id = {};

    switch (type) {
      case "category":
        filter_type = "category";
        db_filter_by_id = await CategoryDB.findById(type_id);
        break;
      case "subcategory":
        filter_type = "sub_category";
        db_filter_by_id = await SubCategoryDB.findById(type_id);
        break;
      case "childcategory":
        filter_type = "child_category";
        db_filter_by_id = await ChildCategoryDB.findById(type_id);
        break;
      case "tag":
        filter_type = "tags";
        db_filter_by_id = await TagDB.findById(type_id);
        break;
    }
    let filter_obj = {};
    filter_obj[`${filter_type}`] = type_id;
    console.log(filter_obj);

    if (!filter_type) {
      next(new Error(`No '${type}' Filter Type in Router`));
      return;
    }
    if (db_filter_by_id) {
      let result = await DB.find(filter_obj)
        .skip(skip_count)
        .limit(limit)
        .populate("category sub_category tags");

      if (result.length) {
        Helper.fMsg(
          res,
          `All Products Paginated by ${filter_type} Page Number ${page_num}, for ${limit} limited Products`,
          result
        );
      } else {
        next(
          new Error(
            `All Products Paginated, No more Products with ${filter_type} id`
          )
        );
      }
    } else {
      next(new Error(`No Products with ${filter_type} id`));
    }
  } else {
    next(new Error("Page Number must be greater than 0"));
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
  filterBy,
};
