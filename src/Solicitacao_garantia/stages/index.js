const { initialStage } = require('./0');

const { primeiraMensagem } = require('./1.js');
const { segundaMensagem } = require('./2.js');
const { terceiraMensagem } = require('./3.js');
const { quartaMensagem } = require('./4.js');

const intents = { initialStage, primeiraMensagem, segundaMensagem, terceiraMensagem, quartaMensagem}

module.exports.intents = intents;
