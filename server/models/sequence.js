const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxCampaignId: {type: Number, required: true},
    maxCharacterId: {type: Number, required: true},
    maxScenarioId: {type: Number, required: true}
});

module.exports = mongoose.model('Sequence', sequenceSchema);