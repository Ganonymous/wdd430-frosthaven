var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Scenario = require('../models/scenario');
const scenario = require('../models/scenario');

router.get('/', (req, res, next) => {
   Scenario.find().lean()
    .then(scenarios => res.status(200).json(scenarios))
    .catch(error => res.status(500).json({error: error.message})) 
});

router.post('/', (req, res, next) => {
    const maxScenarioId = sequenceGenerator.nextId('scenarios');

    const scenario = new Scenario({
        id: maxScenarioId,
        campaign: req.body.campaign,
        scenarioNumber: req.body.scenarioNumber,
        name: req.body.name,
        status: req.body.status,
        requirements: req.body.requirements,
        remainingLoot: req.body.remainingLoot,
        completionDate: req.body.completionDate,
    })

    scenario.save()
        .then(createdScenario => {
            res.status(201).json({
                message: 'Scenario added successfully',
                scenario: createdScenario
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
    Scenario.findOne({id: req.params.id})
        .then(scenario => {
            scenario.scenarioNumber = req.body.scenarioNumber
            scenario.name = req.body.name;
            scenario.status = req.body.status;
            scenario.requirements = req.body.requirements;
            scenario.remainingLoot = req.body.remainingLoot;
            scenario.completionDate = req.body.completionDate;

            Scenario.updateOne({id: req.params.id}, scenario)
                .then(result => res.status(204).json({message: "Scenario updated successfully"}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Scenario not found', error: error}));
});

router.delete('/:id', (req, res, next) => {
    Scenario.findOne({id: req.params.id})
        .then(scenario => {
             Scenario.deleteOne({id: req.params.id})
                .then(result => res.status(204).json({message: 'Scenario deleted successfully'}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Scenario not found', error: error}))
});

module.exports = router