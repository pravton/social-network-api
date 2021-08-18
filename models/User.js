const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required!'],
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: ['/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/', 'Please enter a valid email address!']
    },
    thoughts: {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    },
    friends: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  },
);


// Get friends count
UserSchema.virtual('friendsCount').get(function() {
  return this.friends.length;
});

// create the User model
const User = model('User', UserSchema);

// export user model
module.exports = User;