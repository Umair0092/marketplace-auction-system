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
  startingPrice: {
    type: Number,
    required: [true, 'Please add a starting price']
  },
  currentBid: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
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
  bids: [
    {
      user: {
        type: String, // For simplicity using string username/id
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
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
