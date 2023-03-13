const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ticketID: {
    type: String,
    // required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  department: {
    type: String,
    // required: true,
  },
  priority: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: String,
  }
});

module.exports = mongoose.model("Ticket", TicketSchema);
