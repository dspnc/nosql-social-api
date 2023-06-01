const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughts) => res.json(dbThoughts))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one Thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughts) => {
        if (!dbThoughts) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(dbThoughts);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create Thought
  // push the created thought's _id to the associated user's thoughts array field
  createThought(req,res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUsers) => {
        if (!dbUsers) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }

        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // update Thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughts) => {
        if (!dbThoughts) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughts);
      })
      .catch((err) => res.json(err));
  },

  // delete Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((dbThoughts) => {
        if (!dbThoughts) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } }, 
          { new: true }
        );
      })
      .then((dbUsers) => {
        if (!dbUsers) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughts) => {
        if (!dbThoughts) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(dbThoughts);
      })
      .catch((err) => res.json(err));
  },

  // delete reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((dbThoughts) => res.json(dbThoughts))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;