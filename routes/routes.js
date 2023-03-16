const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/Ticket");
const kbaseController = require("../controllers/Kbase");

router.route("/").post(ticketController.getAllTickets);
router.route("/submitticket").post(ticketController.createTicket);
router
  .route("/ticket/:ticketID")
  .post(ticketController.replyTicket)
  .get(ticketController.viewTicket)
  .delete(ticketController.deleteTicket);

router.route("/ticket/close/:ticketID").post(ticketController.closeTicket);

router.route("/tickets").get(ticketController.getAllTickets);
router.route("/knowledgebase").get(kbaseController.getAllKbase);
router.route("/knowledgebase/post").post(kbaseController.createKbase);
router.route("/knowledgebase/:title").get(kbaseController.viewKbase);
router.route("/knowledgebase/post/pending").get(kbaseController.getAllKbase);

module.exports = router;
