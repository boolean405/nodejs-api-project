require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const Helper = require("./utils/helper");
const Redis = require("./utils/redis");

const port = process.env.PORT || 4000

// Connect Mongo Database
// mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Success, MONGODB Connected");

    // Run Server
    server.listen(
      port,
      console.log(`Server is running at port ${port}`)
    );
  })
  .catch((error) => console.error(error));

// Use Express Json to get Body Data
app.use(express.json());
app.use(fileUpload());

// Router Section
const permit_router = require("./routes/permit");
const role_router = require("./routes/role");
const user_router = require("./routes/user");
const category_router = require("./routes/category");
const sub_category_router = require("./routes/sub_category");
// const child_category_router = require('./routes/child_category');
const tag_router = require("./routes/tag");
const delivery_router = require("./routes/delivery");
const product_router = require("./routes/product");
const order_router = require("./routes/order");

// For validation
const { validateToken, validateRole } = require("./utils/validator");

app.use("/api/permits", [validateToken(), validateRole("Owner"), permit_router]);
app.use("/api/roles", [validateToken(), validateRole("Owner"), role_router]);
app.use("/api/users", user_router);
app.use("/api/categories", category_router);
app.use("/api/subcategories", sub_category_router);
// app.use('/api/childcategories', child_category_router);
app.use("/api/tags", tag_router);
app.use("/api/deliveries", delivery_router);
app.use("/api/products", product_router);
app.use("/api/orders", [validateToken(), order_router]);

// Error Handling
app.use((err, req, res, next) => {
  // console.error(err.stack)
  err.status = err.status || 500;
  res.status(err.status).json({ con: false, msg: err.message });
});

// Migration Default Data
const defaultData = async () => {
  let migrator = require("./migrations/migrator");
  await migrator.defaultDataMigrate();
  await Helper.timer(1);
  await migrator.backup();
};

// Call all Default Data once time
defaultData();

// Socket.io Chatting
io.of("api/chat")
  .use(async (socket, next) => {
    let token = socket.handshake.query.token;
    try {
      if (token) {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded) {
          let user = await Redis.get(decoded._id);
          if (user) {
            socket.user_data = user;
            next();
          } else {
            next(new Error("Tokenization Error"));
          }
        } else {
          next(new Error("Tokenization Error"));
        }
      } else {
        next(new Error("Tokenization Error"));
      }
    } catch (error) {
      next(new Error("Tokenization Error"));
    }
  })
  .on("connection", (socket) => {
    require("./utils/chat").initialize(io, socket);
  });
