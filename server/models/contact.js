const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String },
   phone: { type: String },
   group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}]
});

module.exports = mongoose.model('Contact', messageSchema);