'use strict'
const awsServerlessExpress = require('aws-serverless-express');
const service = require('./src/service');
const server = awsServerlessExpress.createServer(service);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);