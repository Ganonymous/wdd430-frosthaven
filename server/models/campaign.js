const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    id: String,
    groupName: String,
    inspiration: Number,
    morale: Number,
    frosthavenResources: {lumber: Number, metal: Number, hide: Number, axenuts: Number, arrowvines: Number, corpsecaps: Number, flamefruits: Number, snowthistles: Number, rockroots: Number},
    stickers: [{name: String}],
    buildings: [{name: String, level: Number, isWrecked: Boolean}],
    prosperity: {level: Number, toNext: Number, progress: Number},
    guardUpgrades: [{source: String, effect: String}],
    soldiers: Number,
    calendar: {year: Number, week: Number, lastH: {year: Number, week: Number}, pendingEvents: [{year: Number, week: Number, section: Number}]}
});

module.exports(mongoose.model('Campaign', campaignSchema))