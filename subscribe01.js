// ---------------------------------------------------------
// Configuración global
// ---------------------------------------------------------
require("./config/config");

// ---------------------------------------------------------
// DEBUG module
// ---------------------------------------------------------
let debug = require("debug")("subscribe01");

// ---------------------------------------------------------
// STOMP module
// ---------------------------------------------------------
let Stomp = require("stompjs");

console.log("+---------------------------------------------------+");
console.log("|  STOMP SUBSCRIBE 01 Example (subscribe01.js)      |");
console.log("+---------------------------------------------------+");

// Destination QUEUE as Argument
const argv = require("yargs")
  .options({
    queue: {
      alias: "q",
      desc: "Subscribe from Queue",
      demand: true
    }
  })
  .help().argv;

const FROM_QUEUE = "/queue/" + argv.queue;

debug("Subscribe from Queue .: [%s]", FROM_QUEUE);
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

let receiveMessage = function(aMessage) {  
    // called when the client receives a STOMP message from the server
    console.log("\n\n");
    console.log("+---------------------------------------------------+");
    console.log("|  NEW MESSAGE RETRIEVED ...                        |");
    console.log("+---------------------------------------------------+");
    debug("Message received [%o].", aMessage);
    if (aMessage.headers) {
      console.log("got message with headers: \n%o", aMessage.headers)
    } else {
      console.log("got message with NO headers");
    }
    if (aMessage.body) {
      console.log("\ngot message with body " + aMessage.body)
    } else {
      console.log("\ngot empty message");
    }
  };

let connectCallback = function(frame) {
  // called back after the client is connected and authenticated to the STOMP server
  debug("On connectCallback() funtion");
  console.log("STOMP Client connection SUCCESS");

  console.log(`STOMP Client BEGIN to SUBSCRIBE MESSAGES from queue ${FROM_QUEUE}`);
  let subscription = client.subscribe(FROM_QUEUE, receiveMessage);
  debug("Received subscription id [%o]", subscription);
  console.log(`Press ^C (CTRL+C) to interrupt and EXIT.`);
};

let errorCallback = function(error) {
  debug("On errorCallback() funtion");
  // display the error's message header:
  debug("Connection ERROR [%o]", error);
  console.log(`Connection ERROR [${error.message}]`);
  debug("Exiting process with return code '2'");
  process.exit(2);
};

// Connecting
let headers = {
  login: process.env.STOMP_USER,
  passcode: process.env.STOMP_PASS
};

console.log("STOMP Client connecting ...");
debug("Using headers[%o]", headers);
client.connect(headers, connectCallback, errorCallback);

process.on('SIGINT', function() {
    console.log("\nSIGINT (CTRL+C) captured. ");
    client.disconnect(function(frame) {
    debug("STOMP Client disconnecting ...");
    console.log("STOMP client succesfully disconnected.");
  });
  debug("Exiting process with return code '0'");
	process.exit(0);
});
