
const { GraphQLClient } = require('graphql-request');
const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);

module.exports = {
  setSpellCache: async function () {
    //graphQL request for cache
    return client.request(`{ spells 
                  {
                    index
                    name
                  }
                }`)
      .then(res => {
        return res;
        // console.log('dataToSend:', dataToSend)
      })
      .catch(err => console.log('error setting cached spell list:', err.message));
  }
}