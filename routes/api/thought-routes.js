const router = require('express').Router();
const {
  getAllThoughts,
  getThoughById,
  addThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/')
  .get(getAllThoughts)
  .post(addThought);

// /api/thoughts/:thoughtId 
router.route('/:thoughtId')
  .get(getThoughById)
  .put(updateThought);

// /api/thoughts/:thoughtId/:userId 
router.route('/:thoughtId/:userId')
  .delete(removeThought);

// /api/thoughts/:thoughtId/reactions 
router.route('/:thoughtId/reactions')
  .post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;