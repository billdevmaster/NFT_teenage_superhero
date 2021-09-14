const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    tokenId: {
        type: Number,
    },
    collectionId: {
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
    description: {
        type: String,
    },
    txHash: {
        type: String,
    },
},
{
  timestamps: true
});

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item;
