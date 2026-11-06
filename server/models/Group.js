import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // "admin" can add/remove members and delete anyone's tasks.
    // "member" can view the group, create tasks and update tasks.
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },

    // The creator. Always an admin, and the only person who can
    // delete the group or change other members' roles.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [memberSchema],
  },
  { timestamps: true }
);

// Fast lookup of "all groups this user belongs to"
groupSchema.index({ "members.user": 1 });

const Group = mongoose.model("Group", groupSchema);

export default Group;
