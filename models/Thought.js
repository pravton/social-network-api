const { Schema, model, Types } = require('mongoose');
const dateFormat = require('dateformat');

// schema for reactions
const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      max: [280, 'You exceeded the allowed 280 character limit!']
    },
    userName: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdDate => dateFormat(createdDate, "dddd, mmmm dS, yyyy, h:MM:ss TT")
    }
  }
);


// schema for thoughts
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min: [1, 'Please enter a valid thought!'],
      max: [280, 'You exceeded the allowed 280 character limit!']
    },
    createdAtDate: {
      type: Date,
      default: Date.now,
      get: createdDate => dateFormat(createdDate, "dddd, mmmm dS, yyyy, h:MM:ss TT")
    },
    userName: {
      type: String,
      required: true
    },
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get reactionCount
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// create the thought model
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;

