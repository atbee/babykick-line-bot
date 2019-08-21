'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
const contents = require('./contents.json');

// create LINE SDK client
const client = new line.Client(config);
const app = express();

app.get('/webhook', (req, res) => res.end(`I'm listening. Please access with POST.`));

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});


// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Hook recieved: " + JSON.stringify(event.message));
  }

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
    case 'follow': // greeting event
      return client.replyMessage(
        event.replyToken, contents["welcome"]
      );
    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  switch (message.text) {
    case 'นับลูกดิ้น':
      let time = new Date().getHours()
      // check time must not exceed 9 o'clock
      if (inRange(time, 5, 9)) {
        return client.replyMessage(
          replyToken, contents["menu-count"]
        );
      } else {
        return client.replyMessage(
          replyToken, contents["menu-count"]
          // replyToken, contents["menu-count-ctt"]
        );
      }
    case 'คู่มือคุณแม่':
      return client.replyMessage(
        replyToken, contents["menu-manual"]
      );
    case '1':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '1.1':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '1.2':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '1.3':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '2':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '3':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '4':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '5':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '6':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '7':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '8':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    case '9':
      return client.replyMessage(
        replyToken, contents["waiting"]
      )
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
  }
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken, contens["default-sticker"]
  );
}

function inRange(value, min, max) {
  return ((value - min) * (value - max) <= 0);
}

// listen on port
const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
