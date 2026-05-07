const express = require('express');
const router = express.Router();
const {
  getAuctions,
  getAuction,
  createAuction,
  placeBid,
  closeAuction
} = require('../controllers/auctionController');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAuctions)
  .post(protect, createAuction);

router.route('/:id')
  .get(getAuction);

router.route('/:id/bid')
  .post(protect, placeBid);

router.route('/:id/close')
  .patch(protect, closeAuction);



module.exports = router;
