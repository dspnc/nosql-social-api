const { Schema, Types } = require('mongoose');
const {reactionSchema} = require('./Reaction')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    virtuals: {
      reactionCount: {
      type: Number,
     get: function() {
        return this.reactions.length;
      },
      },
    },
  }
  );


module.exports = thoughtSchema;
