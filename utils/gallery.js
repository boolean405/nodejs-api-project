const fs = require("fs");

let uploadSingleFile = async (req, res, next) => {
  if (req.files) {
    if (req.files.file) {
      let file_name = req.files.file.name;
      file_name = new Date().valueOf() + "_" + file_name;
      await req.files.file.mv(`./uploads/${file_name}`);
      req.body["image"] = file_name;
      next();
    } else {
      next(new Error("Need file to upload"));
    }
  } else {
    next();
  }
};

let uploadMultipleFile = async (req, res, next) => {
  if (req.files) {
    if (req.files.files) {
      let file_names = [];
      if (req.files.files.length > 1) {
        req.files.files.forEach(async (file) => {
          let file_name = new Date().valueOf() + "_" + file.name;
          file_names.push(file_name);
          await file.mv(`./uploads/${file_name}`);
        });
        req.body["images"] = file_names;
        next();
      } else if (req.files.files) {
        let file_name = new Date().valueOf() + "_" + req.files.files.name;
        file_names.push(file_name);
        await req.files.files.mv(`./uploads/${file_name}`);
        req.body["images"] = file_names;
        next();
      }
    } else {
      next(new Error("Need files to upload"));
    }
  } else {
    next();
  }
};

let deleteFile = async (file_name) => {
  let file_path = `./uploads/${file_name}`;
  await fs.unlinkSync(file_path);
};

let deleteMultipleFile = async (file_names) => {
  file_names.forEach(async (file_name) => {
    await deleteFile(file_name);
  });
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFile,
  deleteFile,
  deleteMultipleFile,
};
