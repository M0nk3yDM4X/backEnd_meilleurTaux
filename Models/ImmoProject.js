const mongoose = require("mongoose");

const ImmoProject = mongoose.model("ImmoProject", {
  typeOfProperty: String,
  stateOfProperty: String,
  useOfProperty: String,
  userSituation: String,
  locationOfProperty: String,
  amount: {
    estimated: Number,
    works: Number,
    notarial: Number,
    total: Number
  },
  email: String
});

module.exports = ImmoProject;
