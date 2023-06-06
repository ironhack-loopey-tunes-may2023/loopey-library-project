const { mongoose, Schema, model } = require('mongoose');

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author"
    },
    rating: Number
  },
  {
    timestamps: true
  }
);

module.exports = model('Book', bookSchema);
