const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },

  born: {
    type: Number,
  },

  book: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

authorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
