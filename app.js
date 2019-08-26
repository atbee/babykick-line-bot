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
    case 'พัฒนาการลูกน้อย': // manual 1
      return client.replyMessage(
        replyToken, contents["menu-manual-1"]
      )
    case 'พัฒนาการลูกน้อยในไตรมาสที่ 1':
      return client.replyMessage(
        replyToken, contents["menu-manual-1-1"]
      )
    case 'พัฒนาการลูกน้อยในไตรมาสที่ 2':
      return client.replyMessage(
        replyToken, contents["menu-manual-1-2"]
      )
    case 'พัฒนาการลูกน้อยในไตรมาสที่ 3':
      return client.replyMessage(
        replyToken, contents["menu-manual-1-3"]
      )
    case 'การเปลี่ยนแปลงด้านร่างกาย': // manual 2
      return client.replyMessage(
        replyToken, contents["menu-manual-2"]
      )
    case 'การเปลี่ยนแปลงด้านร่างกายในไตรมาสที่ 1':
      return client.replyMessage(
        replyToken, contents["menu-manual-2-1"]
      )
    case 'การเปลี่ยนแปลงด้านร่างกายในไตรมาสที่ 2':
      return client.replyMessage(
        replyToken, contents["menu-manual-2-2"]
      )
    case 'การเปลี่ยนแปลงด้านร่างกายในไตรมาสที่ 3':
      return client.replyMessage(
        replyToken, contents["menu-manual-2-3"]
      )
    case 'โภชนาการสำหรับคุณแม่': // manual 3
      return client.replyMessage(
        replyToken, contents["menu-manual-3"]
      )
    case 'การออกกำลังกายสำหรับคุณแม่': // manual 4
      return client.replyMessage(
        replyToken, contents["menu-manual-4"]
      )
    case 'กายบริหารแบบคีเกล':
      return replyText(replyToken, contents["menu-manual-4-1"]);
    case 'ท่านั่งจับปลายเท้า':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-2"]
      )
    case 'ท่านั่งยกมือดันอากาศ':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-3"]
      )
    case 'ท่าโก่งหลัง':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-4"]
      )
    case 'การนอนหลับพักผ่อนในหญิงตั้งครรภ์': // manual 5
      return client.replyMessage(
        replyToken, contents["menu-manual-5"]
      )
    case 'การมีเพศสัมพันธ์ในระยะตั้งครรภ์':
      return client.replyMessage(
        replyToken, contents["menu-manual-6"]
      )
    case 'อาการไม่สุขสบาย': // manual 7
      return client.replyMessage(
        replyToken, contents["menu-manual-7"]
      )
    case 'ระบบทางเดินอาหาร':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1"]
      )
    case 'ระบบหัวใจและหลอดเลือด':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-2"]
      )
    case 'ระบบหายใจ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-3"]
      )
    case 'ระบบกระดูกและกล้ามเนื้อ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-4"]
      )
    case 'ระบบขับถ่ายปัสสาวะ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-5"]
      )
    case 'ระบบผิวหนัง':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-6"]
      )
    case 'ระบบประสาท':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-7"]
      )
    case 'อาการอื่นๆ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-8"]
      )
    case 'สัญญาณอันตรายที่อาจเกิดขึ้นได้ในระยะตั้งครรภ์': // manual 8
      return client.replyMessage(
        replyToken, contents["menu-manual-8"]
      )
    case 'สัญญาณอันตรายในไตรมาสที่ 1':
      return replyText(replyToken, contents["menu-manual-8-1"]);
    case 'สัญญาณอันตรายในไตรมาสที่ 2':
      return replyText(replyToken, contents["menu-manual-8-2"]);
    case 'สัญญาณอันตรายในไตรมาสที่ 3':
      return replyText(replyToken, contents["menu-manual-8-3"]);
    case 'การเตรียมตัวคลอด': // manual 9
      return replyText(replyToken, contents["menu-manual-9"]["msg"]);
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
  }
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken, contents["default-sticker"]
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
