// BidX Mock Bid Simulator — simulates other users placing bids

import store from '../store/index.js';
import { showToast } from '../components/toast.js';

const botNames = ['CryptoWhale22', 'VintageFanatic', 'LuxCollector', 'HighRoller88', 'BidKing_Pro', 'SilentSniper', 'LastSecondLiz'];

let intervalId = null;

const randomBotBid = async () => {
  const { auctions, user } = store.getState();
  const liveAuctions = auctions.filter(a => new Date(a.endTime).getTime() > Date.now());
  if (liveAuctions.length === 0) return;

  const auction = liveAuctions[Math.floor(Math.random() * liveAuctions.length)];
  const bidAmount = auction.currentBid + auction.minIncrement + Math.floor(Math.random() * auction.minIncrement * 3);
  const botName = botNames[Math.floor(Math.random() * botNames.length)];

  try {
    const response = await fetch(`http://localhost:5001/api/auctions/${auction.id || auction._id}/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidder: botName, amount: bidAmount })
    });

    if (!response.ok) throw new Error('Bot bid failed');
    const result = await response.json();
    const updatedAuction = result.data;

    // Update local store
    store.setState(s => {
      const idx = s.auctions.findIndex(a => a.id === updatedAuction._id || a._id === updatedAuction._id);
      if (idx !== -1) {
        s.auctions[idx] = { ...updatedAuction, id: updatedAuction._id };
      }
      return s;
    });

    store.notify('bid', { auctionId: updatedAuction._id, bidder: botName, amount: bidAmount });

    // If user is logged in and was the previous highest bidder, show outbid toast
    if (user) {
      const userBid = auction.bids.find(b => b.bidder === user.name);
      if (userBid && bidAmount > userBid.amount) {
        showToast('outbid', 'You\'ve been outbid!', `${botName} bid $${bidAmount.toLocaleString()} on "${auction.title}"`);
      }
    }
  } catch (error) {
    console.error('Simulator error:', error);
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
