var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Character = require('../models/character');

router.get('/', (req, res, next) => {
   Character.find().lean()
    .then(characters => res.status(200).json(characters))
    .catch(error => res.status(500).json({error: error.message})) 
});

router.post('/', (req, res, next) => {
    const maxCharacterId = sequenceGenerator.nextId('characters');

    const character = new Character({
        id: maxCharacterId,
        campaign: req.body.campaign,
        name: req.body.name,
        level: 0,
        XP: 0,
        gold: 0,
        player: req.body.player,
        resources: {lumber: 0, metal: 0, hide: 0, axenuts: 0, arrowvines: 0, corpsecaps: 0, flamefruits: 0, snowthistles: 0, rockroots: 0},
        mastery1: req.body.mastery1,
        mastery2: req.body.mastery2,
        checks: 0,
        perks: [],
        status: 'Active'
    })

    character.save()
        .then(createdCharacter => {
            res.status(201).json({
                message: 'Character added successfully',
                character: createdCharacter
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
    Character.findOne({id: req.params.id})
        .then(character => {
            character.name = req.body.name;
            character.level = req.body.level;
            character.XP = req.body.XP;
            character.gold = req.body.gold,
            character.resources = req.body.resources;
            character.mastery1 = req.body.mastery1;
            character.mastery2 = req.body.mastery2;
            character.checks = req.body.checks;
            character.perks = req.body.perks;
            character.status = req.body.status;

            Character.updateOne({id: req.params.id}, character)
                .then(result => res.status(204).json({message: "Character updated successfully"}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Character not found', error: error}));
});

router.delete('/:id', (req, res, next) => {
    Character.findOne({id: req.params.id})
        .then(character => {
             Character.deleteOne({id: req.params.id})
                .then(result => res.status(204).json({message: 'Character deleted successfully'}))
                .catch(error => res.status(500).json({message: 'An error occurred', error: error}));
        })
        .catch(error => res.status(500).json({message: 'Character not found', error: error}))
});

module.exports = router