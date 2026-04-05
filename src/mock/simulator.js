// BidX Mock Bid Simulator — simulates other users placing bids

import store from '../store/index.js';
import { showToast } from '../components/toast.js';

const botNames = ['CryptoWhale22', 'VintageFanatic', 'LuxCollector', 'HighRoller88', 'BidKing_Pro', 'SilentSniper', 'LastSecondLiz'];

let intervalId = null;

const randomBotBid = () => {
  const { auctions, user } = store.getState();
  const liveAuctions = auctions.filter(a => a.endTime > Date.now());
  if (liveAuctions.length === 0) return;

  const auction = liveAuctions[Math.floor(Math.random() * liveAuctions.length)];
  const bidAmount = auction.currentBid + auction.minIncrement + Math.floor(Math.random() * auction.minIncrement * 3);
  const botName = botNames[Math.floor(Math.random() * botNames.length)];

  store.setState(s => {
    const idx = s.auctions.findIndex(a => a.id === auction.id);
    if (idx === -1) return s;
    s.auctions[idx].currentBid = bidAmount;
    s.auctions[idx].totalBids += 1;
    s.auctions[idx].bids.unshift({
      bidder: botName,
      amount: bidAmount,
      time: Date.now(),
      isBot: true,
    });
    return s;
  });

  store.notify('bid', { auctionId: auction.id, bidder: botName, amount: bidAmount });

  // If user is logged in and had the highest bid on this auction, show outbid toast
  if (user) {
    const prev = auction.bids.find(b => b.bidder === user.name);
    if (prev) {
      showToast('outbid', 'You\'ve been outbid!', `${botName} bid $${bidAmount.toLocaleString()} on "${auction.title}"`);
    }
  }
};

export const startSimulator = () => {
  if (intervalId) return;
  // Random bid every 5-15 seconds
  const tick = () => {
    randomBotBid();
    const delay = 5000 + Math.random() * 10000;
    intervalId = setTimeout(tick, delay);
  };
  tick();
};

export const stopSimulator = () => {
  if (intervalId) {
    clearTimeout(intervalId);
    intervalId = null;
  }
};
