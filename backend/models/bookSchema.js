const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  published: {
    type: Number,
  },
  genres: [
    {
      type: String,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
