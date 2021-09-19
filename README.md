# cardinaljs
The javascript library to interact with cardinal API.

## About
cardinaljs is a [Node.js](https://nodejs.org/) module that allows you to interact with [Cardinal API](https://cardinal.gyroskan.com/swagger/index.html).

## Installation
  With the [npm](https://www.npmjs.com/package/cardinaljs) package:
  ```sh-session
  npm install cardinaljs
  ```

## Usage

```javascript
const { Client } = require('cardinaljs');
const client = new Client();

//check the token validity
client.login('token')
  .then(token => console.log('Connected!'))
  .catch(err => console.error('Unable to connect: ' + err));

// Fetch a guild
client.guilds.resolve('guildID')
  .then(guild => {
    if (guild != undefined)
      console.log('Fetched guild ' + guild.guildName );
    else
      console.log('Guild wiht id guildID is not in Cardinal database.');
  })
  .catch(err => console.error('Could not resolve guild guildID: ' + err));
```
