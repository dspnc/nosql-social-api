const { User, Thought } = require("../models");

const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUsers) => res.json(dbUsers))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUsers) => {
        if (!dbUsers) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUsers);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUsers) => res.json(dbUsers))
      .catch((err) => res.json(err));
  },

  // update user by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((dbUsers) => {
        if (!dbUsers) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUsers);
      })
      .catch((err) => res.json(err));
  },

  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((dbUsers) => {
        if (!dbUsers) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        // BONUS: get ids of user's `thoughts` and delete them all
        // $in to find specific things
        return Thought.deleteMany({ _id: { $in: dbUsers.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and associated thoughts deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUsers) => {
        if (!dbUsers) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(dbUsers);
      })
      .catch((err) => res.json(err));
  },

  // delete friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUsers) => {
        if (!dbUsers) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(dbUsers);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;