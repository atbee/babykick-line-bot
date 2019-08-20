'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
const contents = require('./contents.json');

// create LINE SDK client
const client = new line.Client(config);
const app = express();

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

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {

  switch (message.text) {
    case 'นับลูกดิ้น':
      var a = contents["menu-count"];
      replyText(replyToken, a);
    case '1':
      client.replyMessage(
        replyToken, contents["reply"]
      );
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
  }
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Got Sticker');
}

// listen on port
const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
