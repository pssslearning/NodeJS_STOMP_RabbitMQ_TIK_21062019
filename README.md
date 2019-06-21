## NodeJS basic SAMPLES for STOMP to publish & subscribe messages to/from a RabbitMQ broker instance

- Used as demo for **TIK training at Techedge Spain offices on June 21th 2019**.

### Connection configuration

- Please adjust it accordingly in `config\config.js`

### Sample action to publish a message using STOMP to a QUEUE in a RabbitMQ broker instance :

```sh
+---------------------------------------------------+
|  STOMP PUBLISH 01 Example (publish01.js)          |
+---------------------------------------------------+
Opciones:
  --version      Muestra número de versión                            [booleano]
  --queue, -q    Destination Queue                                   [requerido]
  --message, -m  Message String                                      [requerido]
  --help         Muestra ayuda                                        [booleano]
```

Sample invocation:
```sh
node publish01 -m "Hello AMQP to RabbitMQ" -q testQueue
```

Sample invocation (with DEBUG option):
```sh
DEBUG=* node publish01 -m "Hello AMQP to RabbitMQ" -q testQueue
```

### Sample action to subscribe to Queue to retrieve messages from a RabbitMQ broker instance using STOMP:

```sh
+---------------------------------------------------+
|  STOMP SUBSCRIBE 01 Example (subscribe01.js)      |
+---------------------------------------------------+
Opciones:
  --version    Muestra número de versión                              [booleano]
  --queue, -q  Subscribe from Queue                                  [requerido]
  --help       Muestra ayuda                                          [booleano]

Falta argumento requerido: queue

```

Sample invocation:
```sh
node subscribe01 -q testQueue
```

Sample invocation (with DEBUG option):
```sh
DEBUG=* node subscribe01 -q testQueue
```

## REFERENCES

- [RabbitMQ STOMP Plugin](https://www.rabbitmq.com/stomp.html)

- [STOMP - The Simple Text Oriented Messaging Protocol](https://stomp.github.io/)

- [STOMP Over WebSocket - JS -](http://jmesnil.net/stomp-websocket/doc/)

## INSTALLED DEPENDENCIES
```sh
npm install --save stompjs debug yargs uuid
``` 