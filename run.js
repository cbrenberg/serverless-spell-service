'use strict';

//require node modules
require('dotenv').config();

//require modules
const service = require('./src/service');

service.listen(process.env.PORT, () => {
  console.log(`dnd-slackbot-service is listening on port ${process.env.PORT} in ${service.get('env')} mode`);
});