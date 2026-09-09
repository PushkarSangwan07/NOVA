const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    // "comment" = user-written note, "activity" = system-generated log
    // (e.g. "moved this task to Done") so both can render in one feed
    type: { type: String, enum: ["comment", "activity"], default: "comment" },
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
