var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Campaign = require('../models/campaign');

router.get('/', (req, res, next) => {
   Campaign.find().lean()
    .then(campaigns => res.status(200).json(campaigns))
    .catch(error => res.status(500).json({error: error.message})) 
});

router.post('/', (req, res, next) => {
    const maxCampaignId = sequenceGenerator.nextId('campaigns');

    const campaign = new Campaign({
        id: maxCampaignId,
        groupName: req.body.groupName,
        inspiration: 0,
        morale: 0,
        frosthavenResources: {lumber: 0, metal: 0, hide: 0, axenuts: 0, arrowvines: 0, corpsecaps: 0, flamefruits: 0, snowthistles: 0, rockroots: 0},
        stickers: [],
        buildings: [
            {name: craftsman, level: 1, isWrecked: false},
            {name: barracks, level: 1, isWrecked: false},
            {name: alchemist, level: 1, isWrecked: false},
            {name: workshop, level: 1, isWrecked: false}
        ],
        prosperity: {level: 1, toNext: 6, progress: 0},
        guardUpgrades: [],
        soldiers: 4,
        calendar: {year: 1, week: 1, lastH: {year: 0, week: 0}, pendingEvents: [
            {year: 1, week: 5, section: 32.3},
            {year: 1, week: 10, section: 183.3},
            {year: 1, week: 10, section: 21.4},
            {year: 1, week: 20, section: 129.3},
            {year: 2, week: 5, section: 183.3},
            {year: 2, week: 10, section: 183.3},
            {year: 2, week: 20, section: 184.1},
            {year: 4, week: 20, section: 137.2},
        ]}
    })

    campaign.save()
        .then(createdCampaign => {
            res.status(201).json({
                message: 'Campaign added successfully',
                campaign: createdCampaign
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'an error occurred',
                error: error
            })
        })
});

router.put('/:id', (req, res, next) => {
    Campaign.findOne({id: req.params.id})
        .then(campaign => {
            campaign.groupName = req.body.groupName;
            campaign.inspiration = req.body.inspiration;
            campaign.morale = req.body.morale;
            campaign.frosthavenResources = req.body.frosthavenResources;
            campaign.stickers = req.body.stickers;
            campaign.buildings = req.body.buildings;
            campaign.prosperity = req.body.prosperity;
            campaign.guardUpgrades = req.body.guardUpgrades;
            campaign.soldiers = req.body.soldiers;
            campaign.calendar = req.body.calendar;

            Campaign.updateOne({id: req.params.id}, campaign)
                .then(result => res.status(204).json({message: "Campaign updated successfully"}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Campaign not found', error: error}));
});

router.delete('/:id', (req, res, next) => {
    Campaign.findOne({id: req.params.id})
        .then(campaign => {
             Campaign.deleteOne({id: req.params.id})
                .then(result => res.status(204).json({message: 'Campaign deleted successfully'}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Campaign not found', error: error}))
});

module.exports = router