const mongoose = require('mongoose');

const scenarioSchema = mongoose.Schema({
    id: String,
    campaign: String,
    scenarioNumber: Number,
    name: String,
    status: String,
    requirements: [String],
    remainingLoot: [{lootable: String, remaining: Boolean}],
    completionDate: {year: Number, week: Number}
});

module.exports =  mongoose.model('Scenario', scenarioSchema);