const { User, Thought } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // get a single user
  getSingleUser({params}, res) {
    User.findOne({ _id: params.userId })
      .populate(
      {
        path: 'friends',
        select: '-__v'
      })
      .populate(
      {
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!'});
          return;
        }

        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // post a user
  createUser({body}, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));  
  },

  // update a user
  updateUser({ params, body }, res) {
    User.findByIdAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!'});
          return;
        }

        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete a user
  deleteUser({ params }, res) {
    User.findByIdAndDelete({ _id: params.userId })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'});
        return;
      }
      console.log(dbUserData.thoughts);
      return Thought.deleteMany({ _id: {$in: dbUserData.thoughts}});
    })
    .then(deletedData => {
      res.json({message: `User and ${deletedData.deletedCount} thoughts are deleted`});
    })
    .catch(err => res.status(400).json(err));
  },

  // add a friend
  addFriend({ params }, res ) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: { _id: params.friendId }}},
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this id'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

   // remove a friend
   removeFriend({ params }, res ) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId }},
      { new: true }
    )
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this id'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  }


}

module.exports = userController;