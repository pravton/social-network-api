const { User, Thought } = require('../models');

const thoughtController = {

  // get all thoughts
  getAllThoughts( req, res ) {
    Thought.find({})
      .select('-__v')
      .sort({ _d: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        res.status(400).json(err);
      });
  },

  // get one thought by id
  getThoughById({ params }, res ) {
    Thought.findOne({ _id: params.thoughtId })
    .select('-__v')
    .sort({ _d: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
      res.status(400).json(err);
    });
  },

  // add a thought
  addThought({ body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id }},
          { new: true }
        );
      })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!'});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  updateThought({ params, body }, res ) {
    Thought.findByIdAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true})
    .then(dbThoughtData => {
      if(!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!'});
        return;
      }

      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // remove a thought
  removeThought({ params }, res) {
    Thought.findByIdAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if(!deletedThought) {
          res.status(404).json({ message: 'No thought found with this id!'});
          return;
        }
        // res.json(deletedThought);
        return User.findByIdAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId }},
          { new: true }
        );
      })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!'});
          return;
        }

        res.json(dbUserData);
      })
  },

  // add a reaction
  addReaction({ params, body }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body }},
      { new: true, runValidators: true }
    )
    .then(dbReactionData => {
      if(!dbReactionData) {
        res.status(404).json({ message: 'No thought found with this id'});
        return;
      }
      res.json(dbReactionData);
    })
    .catch(err => res.json(err));
  },

  // delete a reaction
  removeReaction({ params }, res ) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId}}},
      { new: true }
    )
    .then(dbReactionData => {
      if(!dbReactionData) {
        res.status(404).json({ message: 'No reaction found with this id'});
        return;
      }
      res.json(dbReactionData);
    })
    .catch(err => res.json(err));
  }
}

module.exports = thoughtController;