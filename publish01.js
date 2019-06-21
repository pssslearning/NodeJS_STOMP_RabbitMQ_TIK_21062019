// ---------------------------------------------------------
// Configuración global
// ---------------------------------------------------------
require("./config/config");

// ---------------------------------------------------------
// DEBUG module
// ---------------------------------------------------------
let debug = require("debug")("publish01");

// ---------------------------------------------------------
// UUID module
// ---------------------------------------------------------
const uuidv4 = require('uuid/v4');

// ---------------------------------------------------------
// STOMP module
// ---------------------------------------------------------
let Stomp = require("stompjs");

console.log("+---------------------------------------------------+");
console.log("|  STOMP PUBLISH 01 Example (publish01.js)          |");
console.log("+---------------------------------------------------+");

// Destination QUEUE as Argument
const argv = require("yargs")
  .options({
    queue: {
      alias: "q",
      desc: "Destination Queue",
      demand: true
    },
    message: {
      alias: "m",
      desc: "Message String",
      demand: true
    }
  })
  .help().argv;

const DEST_QUEUE = "/queue/" + argv.queue;

debug("Destination Queue ....: [%s]", DEST_QUEUE);
debug("process.env.STOMP_PORT: [%o]", process.env.STOMP_PORT);
debug("process.env.STOMP_HOST: [%o]", process.env.STOMP_HOST);
debug("process.env.STOMP_USER: [%o]", process.env.STOMP_USER);
debug("process.env.STOMP_PASS: [%o]", process.env.STOMP_PASS);

// STOMP Client Configuration
const client = Stomp.overTCP(process.env.STOMP_HOST, process.env.STOMP_PORT);
// The client object has a heartbeat field which can be used to configure heart-beating
// by changing its incoming and outgoing integer fields (default value for both is 10000ms):
client.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
client.heartbeat.incoming = 0; // client does not want to receive heartbeats
// from the server
debug("Stomp Client configured [%o]", client);

client.debug = console.log;
let connectCallback = function(frame) {
  // called back after the client is connected and authenticated to the STOMP server
  debug("On connectCallback() funtion");
  console.log("STOMP Client connection SUCCESS");

  // Configuring Message Headers

  let messageHeaders = {
    priority: '9',
    'content-type': 'text/plain',
    'content-encoding': 'utf-8',
    persistent: 'true',
    'correlation-id': 'b6355243-4bbb-4718-8179-db5c6430cf61',
    timestamp: '1561107213',
    type: 'A message type info',
    'app-id': 'Tutorial1',
    'x-customStringHdr1': 'Techedge', // Custom header 1
    'x-customNumberHdr2': '2019',  // Custom header 2
    'x-customStringHdr3': 'TIK de Junio' // Custom header 3
  };

  // Configuring a message as a JSON String
  let currentTime = new Date().getTime();
  debug("-----> %o", currentTime);
  let messageUUID = uuidv4();
  let messageBody = {
        message: argv.message,
        currentTime,
        messageUUID
  };

  console.log(`STOMP Client Publishing a message: ${messageBody} `);
  debug("Using message headers [%o]", messageHeaders)
  client.send(DEST_QUEUE, messageHeaders, JSON.stringify(messageBody));
  console.log(`STOMP Client Message published successfully.`);

  client.disconnect(function(frame) {
    debug("STOMP Client disconnecting ...");
    console.log("STOMP client succesfully disconnected.");
  });
};

let errorCallback = function(error) {
  debug("On errorCallback() funtion");
  // display the error's message header:
  debug("Connection ERROR [%o]", error);
  console.log(`Connection ERROR [${error.message}]`);
};

// Connecting
let headers = {
  login: process.env.STOMP_USER,
  passcode: process.env.STOMP_PASS
};

console.log("STOMP Client connecting ...");
debug("Using headers[%o]", headers);
client.connect(headers, connectCallback, errorCallback);
