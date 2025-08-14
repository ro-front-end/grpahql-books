const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
    minlength: 3,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
