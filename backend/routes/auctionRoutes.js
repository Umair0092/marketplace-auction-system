const express = require('express');
const router = express.Router();
const {
  getAuctions,
  getAuction,
  createAuction,
  placeBid
} = require('../controllers/auctionController');

router.route('/')
  .get(getAuctions)
  .post(createAuction);

router.route('/:id')
  .get(getAuction);

router.route('/:id/bid')
  .post(placeBid);

module.exports = router;
