const mongoose = require('mongoose');

const EnableSchema = mongoose.Schema({
    enabled: {
        type: String,
    },
},
{
  timestamps: true
});

const MintEbale = mongoose.model('Mint_Enable', EnableSchema)

module.exports = MintEbale;
