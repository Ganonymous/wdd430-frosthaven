const mongoose = require('mongoose')

const characterSchema = mongoose.Schema({
    id: String,
    campaign: String,
    name: String,
    level: Number,
    XP: Number,
    gold: Number,
    player: Number,
    resources: {lumber: Number, metal: Number, hide: Number, axenuts: Number, arrowvines: Number, corpsecaps: Number, flamefruits: Number, snowthistles: Number, rockroots: Number},
    mastery1: {requirement: String, complete: Boolean},
    mastery2: {requirement: String, complete: Boolean},
    checks: Number,
    perks: [{name: String, effect: String}],
    status: String
});

module.exports = mongoose.model('Character', characterSchema);