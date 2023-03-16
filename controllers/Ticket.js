const Ticket = require("../models/ticket");
const Reply = require("../models/reply");

// ticket-Id generation
function generateTicketId() {
  const digits = "0123456789";
  let ticketId = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    ticketId += digits[randomIndex];
  }
  return ticketId;
}

/**
 * @desc    Create Ticket
 * @route   POST /submiticket
 * @access  Public
 */
const createTicket = async (req, res, next) => {
  try {
    const { name, email, subject, message, department, priority, image } =
      req.body;
    if (!name || !email || !subject || !message || !department) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    const ticketID = `${department}-${generateTicketId()}`;
    const date = new Date();
    const formatDate = (date) => {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options);
    };
    const createdAt = formatDate(date);
    console.log(createdAt);
    const ticket = {
      name,
      email,
      ticketID,
      subject,
      message,
      image,
      department,
      status: "Open",
      priority,
      createdAt,
    };

    const result = await Ticket.create(ticket);

    res.status(201).json({
      ticketID: result.ticketID,
      status: result.status,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reply Ticket
 * @route   POST /ticket/:ticketID
 * @access  Private
 */
const replyTicket = async (req, res, next) => {
  try {
    const { ticketID } = req.params;

    if (!ticketID) {
      return res.status(400).json({ message: "Ticket ID required." });
    }

    const { sender, message } = req.body;
    if (!sender || !message) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    const createdAt = new Date();
    const result = await Reply.create({
      ticketID,
      sender,
      message,
      createdAt,
    });

    await Ticket.updateOne({ ticketID }, { status: "Solved" });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    View All Ticket
 * @route   GET /tickets
 * @access  Public
 */
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    if (tickets.length === 0) {
      return res.status(204).json({ message: "No tickets found" });
    }
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Retrieve a single ticket and its replies from the database based on the ticket ID
/**
 * @desc    View All Ticket
 * @route   GET /ticket/:ticketID
 * @access  Public
 */
const viewTicket = async (req, res) => {
  const ticketID = req.params.ticketID;

  if (!ticketID) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await Ticket.findOne({ ticketID }).exec();
    const replies = await Reply.find({ ticketID }).exec();

    if (!ticket) {
      return res
        .status(404)
        .json({ message: `Ticket with ID ${ticketID} not found` });
    }

    res.json({ ticket, replies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    View Close Ticket
 * @route   GET /ticket/:ticketID
 * @access  Public
 */
const closeTicket = async (req, res) => {
  const ticketID = req.params.ticketID;

  if (!ticketID) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await Ticket.findOne({ ticketID }).exec();

    if (!ticket) {
      return res
        .status(404)
        .json({ message: `Ticket with ID ${ticketID} not found` });
    } else {
      await Ticket.updateOne({ ticketID }, { status: "Closed" });
    }

    res.json({ ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Delete Ticket
 * @route   DELETE /ticket/:ticketID
 * @access  Private
 */
const deleteTicket = async (req, res) => {
  const ticketID = req.params.ticketID;

  if (!ticketID) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await Ticket.findOne({ ticketID }).exec();
    if (!ticket) {
      return res
        .status(404)
        .json({ message: `Ticket with ID ${ticketID} not found` });
    }

    let result;
    let reply = await Reply.findOne({ ticketID }).exec();
    if (reply) {
      result = await Promise.all([
        Reply.deleteOne({ ticketID }).exec(),
        Ticket.deleteOne({ ticketID }).exec(),
      ]);
    } else {
      result = await Ticket.deleteOne({ ticketID }).exec();
    }

    if (result[0].deletedCount === 1 || result.deletedCount === 1) {
      return res
        .status(200)
        .json({ message: `Ticket with ID ${ticketID} has been deleted` });
    } else {
      return res.status(500).json({ message: "Failed to delete ticket" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  replyTicket,
  viewTicket,
  createTicket,
  getAllTickets,
  deleteTicket,
  closeTicket,
};
