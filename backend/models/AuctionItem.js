const mongoose = require('mongoose');

const auctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  startingPrice: {
    type: Number,
    required: [true, 'Please add a starting price']
  },
  currentBid: {
    type: Number,
    default: 0
  },
  minIncrement: {
    type: Number,
    default: 1
  },
  totalBids: {
    type: Number,
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  seller: {
    name: String,
    id: String,
    rating: Number
  },
  specs: {
    type: Map,
    of: String
  },
  bids: [
    {
      bidder: String, // Changed from user to bidder to match frontend
      amount: Number,
      time: { type: Date, default: Date.now },
      isBot: { type: Boolean, default: false }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('AuctionItem', auctionItemSchema);
