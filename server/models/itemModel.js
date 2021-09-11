const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    tokenId: {
        type: Number,
    },
    collectionId: {
        type: String,
    },
    pairKey: {
        type: String,
    },
    name: {
        type: String,
    },
    metadata: {
        type: String,
    },
    image: {
        type: String,
    },
    creator: {
        type: String,
    },
    owner: {
        type: String,
    },
    currency: {
        type: String,
    },
    royalties: {
        type: String,
    },
    description: {
        type: String,
    },
    txHash: {
        type: String,
    },
    status: {
        type: String,
    },
    views: {
        type: Number
    },
},
{
  timestamps: true
});

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item;
