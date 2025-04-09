var Sequence = require('../models/sequence');

var maxCampaignId;
var maxCharacterId;
var maxScenarioId;
var sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne().then(sequence => {
    sequenceId = sequence._id;
    maxCampaignId = sequence.maxCampaignId;
    maxCharacterId = sequence.maxCharacterId;
    maxScenarioId = sequence.maxScenarioId;
  }).catch(error => {return res.status(500).json({error: error.message})});
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'campaigns':
      maxCampaignId++;
      updateObject = {maxCampaignId: maxCampaignId};
      nextId = maxCampaignId;
      break;
    case 'characters':
      maxCharacterId++;
      updateObject = {maxCharacterId: maxCharacterId};
      nextId = maxCharacterId;
      break;
    case 'scenarios':
      maxScenarioId++;
      updateObject = {maxScenarioId: maxScenarioId};
      nextId = maxScenarioId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({_id: sequenceId}, {updateObject}).then().catch(err => {
    console.log(`nextID error = ${err}`);
    nextId = null;
  });

  return nextId;
}

module.exports = new SequenceGenerator();
