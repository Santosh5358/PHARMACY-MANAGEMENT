const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: {type: String},
  quantity: { type: Number, required: false, min: 0 },
});

module.exports = mongoose.model('Item', ItemSchema);
