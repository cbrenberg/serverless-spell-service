'use strict'

const express = require('express');
const service = express();
const { GraphQLClient } = require('graphql-request');

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);
const cache = require('./cache')

//initialize in-memory cache variable of all spell indices and names on startup
let spellListCache;
(async function () {
  spellListCache = await cache.setSpellCache();
  console.log('cache retrieved:', spellListCache)
})();

//handle spell requests from host app
service.get('/spell-details/:spellName', async (req, res, next) => {
  const spellName = req.params.spellName;
  console.log('incoming GET request for ' + spellName);
  console.log((spellListCache && spellListCache.spells) ? 'will retrieve index from cache' : 'no spell cache available');

  //if service is interrupted, reset cache
  if (!spellListCache || !spellListCache.spells) {
    console.log('resetting spell cache');
    spellListCache = await cache.setSpellCache();
  }

  let spellMatch;
  try {
    //find matching spell from cache by name
    spellMatch = spellListCache.spells.filter(spell => spell.name.toLowerCase().includes(spellName.toLowerCase()));
  } catch (err) {
    console.log('Error retrieving spell from cache', err);
  }

  //request spell details from graphQL server by spell index
  client.request(`{
  spell (index: ${spellMatch[0].index}) {
      name
      description
    }
  }`)
    .then(response => {
      //send spell description back to client
      let stringResponse = response.spell.description;
      res.status(200).send(stringResponse);
    })
    .catch(err => {
      console.log('graphQL request error:', err);
      res.sendStatus(500);
    });

  // **EXAMPLE SPELL DETAIL RESPONSE**

  //{ spell:
  //   {
  //     name: 'Mage Hand',
  //     description:
  //       'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.'
  //   }
  // }

});


module.exports = service;