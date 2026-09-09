const express = require("express");
const { getComments, addComment } = require("../controllers/commentController");

// mergeParams so this router can read :projectId and :taskId from the parent
const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", addComment);

module.exports = router;
