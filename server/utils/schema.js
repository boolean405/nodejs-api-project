const Joi = require("joi");

module.exports = {
  PermitSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string().required(),
    }),
  },

  RoleSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string().required(),
    }),
    addPermit: Joi.object({
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    removePermit: Joi.object({
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },

  UserSchema: {
    register: Joi.object({
      name: Joi.string().min(4).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(8).max(12).required(),
      password: Joi.string().min(8).max(16).required(),
      re_password: Joi.ref("password"),
    }),
    login: Joi.object({
      phone: Joi.string().min(8).max(12),
      email: Joi.string().min(8),
      password: Joi.string().min(8).max(16).required(),
    }),
    addRole: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    removeRole: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      role_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    addPermit: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    removePermit: Joi.object({
      user_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permit_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  CategorySchema: {
    add: Joi.object({
      name: Joi.string().required(),
      image: Joi.string().required(),
      free_pickup_zone: Joi.string().required(),
      extra_charge_pickup_zone: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
      image: Joi.string(),
      free_pickup_zone: Joi.string(),
      extra_charge_pickup_zone: Joi.string(),
    }),
  },
  SubCategorySchema: {
    add: Joi.object({
      parent_category: Joi.string().required(),
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  ChildCategorySchema: {
    add: Joi.object({
      sub_category: Joi.string().required(),
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  TagSchema: {
    add: Joi.object({
      name: Joi.string().required(),
    }),
    patch: Joi.object({
      name: Joi.string(),
    }),
  },
  DeliverySchema: {
    add: Joi.object({
      name: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required(),
      duration: Joi.string().required(),
      remarks: Joi.string(),
    }),
    patch: Joi.object({
      name: Joi.string(),
      image: Joi.string(),
      price: Joi.number(),
      duration: Joi.string(),
      remarks: Joi.string(),
    }),
  },
  // need to fix product schema, images error
  ProductSchema: {
    add: Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      discount: Joi.number().required(),
      rating: Joi.number().required(),
      images: Joi.string().required(),
      category: Joi.string().required(),
      sub_category: Joi.string().required(),
      tags: Joi.string().required(),
      delivery: Joi.string().required(),
      desc: Joi.string().required(),
      detail: Joi.string().required(),
      max_person: Joi.string().required(),
      duration: Joi.string().required(),
      start_time: Joi.string().required(),
      recommended: Joi.string().required(),
      not_recommended: Joi.string().required(),
      highlights: Joi.string().required(),
      included: Joi.string().required(),
      excluded: Joi.string().required(),
      to_bring: Joi.string().required(),
      destinations: Joi.string().required(),
      expect_detail: Joi.string().required(),
    }),
    patch: Joi.object({}),
  },
  OrderSchema: {
    add: Joi.object({}),
    patch: Joi.object({}),
  },

  AllSchema: {
    id: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
