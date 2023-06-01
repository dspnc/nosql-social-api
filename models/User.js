const { Schema, model, Types } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
    },
    thoughts: {
      type: [Types.ObjectId],
      default: [],
    },
    friends: {
      type: [Types.ObjectId],
      default: [],
    },
  },
  {
    virtuals: {
      friendCount: {
      type: Number,
      get: function() {
        return this.friends.length;
      },
     },
    },
  }
  );
  
const User = model('user', userSchema);

module.exports = User;
