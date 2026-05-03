const AuctionItem = require('../models/AuctionItem');

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
exports.getAuctions = async (req, res) => {
  try {
    const auctions = await AuctionItem.find({ status: 'active' }).sort('-createdAt');
    res.status(200).json({ success: true, count: auctions.length, data: auctions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Public
exports.getAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }
    res.status(200).json({ success: true, data: auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Simplified for now)
exports.createAuction = async (req, res) => {
  try {
    const auction = await AuctionItem.create(req.body);
    res.status(201).json({ success: true, data: auction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Place a bid
// @route   POST /api/auctions/:id/bid
// @access  Private (Simplified)
exports.placeBid = async (req, res) => {
  try {
    const { user, amount } = req.body;
    const auction = await AuctionItem.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    if (auction.status === 'closed' || new Date() > new Date(auction.endTime)) {
      auction.status = 'closed';
      await auction.save();
      return res.status(400).json({ success: false, message: 'Auction is closed' });
    }

    if (amount <= auction.currentBid || amount <= auction.startingPrice) {
      return res.status(400).json({ success: false, message: 'Bid must be higher than current price' });
    }

    auction.bids.push({ user, amount });
    auction.currentBid = amount;
    await auction.save();

    res.status(200).json({ success: true, data: auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
