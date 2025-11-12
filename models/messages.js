const mongoose = require("mongoose");
require("dotenv").config();

const urlDB = process.env.atlas_DB;

main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/openchat");
  await mongoose.connect(urlDB);
}

const msgSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  hint: {
    type: String,
  },
});

const newMsg = mongoose.model("newMsg", msgSchema);
module.exports = newMsg;
