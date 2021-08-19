const { User } = require('../models');

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
    User.findOne({ _id: params.id })
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
    User.findByIdAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
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
    User.findByIdAndDelete({ _id: params.id })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'});
        return;
      }

      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  }


}

module.exports = userController;