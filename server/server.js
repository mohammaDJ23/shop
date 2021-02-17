const path = require("path");

// packages

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

// files

const graphqlMiddleware = require("./middleware/graphql/graphql");
const morganMiddleware = require("./middleware/morgan/morgan");
const multerMiddleware = require("./middleware/multer/multer");
const imageController = require("./controllers/image/image");
const errorMiddleware = require("./middleware/error/error");
const token = require("./middleware/token/token");

// configs

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

// middlewars

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(morganMiddleware);
app.use(multerMiddleware);
app.post("/image", imageController);
app.use("/graphql", graphqlMiddleware);
app.use(errorMiddleware);

// connaction to the database

(async function databaseConnection() {
  try {
    // connect to the database

    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    // run server after connect to the database

    app.listen(PORT, function () {
      console.log("server is running");
    });
  } catch (error) {
    console.log(error);
  }
})();
