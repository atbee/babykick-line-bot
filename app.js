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
    case 'เมนู':
      return client.replyMessage(
        replyToken, contents["menu"]
      );
    case 'นับลูกดิ้น':
      return client.replyMessage(
        replyToken, contents["menu-count"]
      );
    // let t = getHours()
    // // check time must not exceed 4-8 o'clock
    // if (inRange(t, 4, 8)) {
    //   return client.replyMessage(
    //     replyToken, contents["menu-count"]
    //   );
    // } else {
    //   return client.replyMessage(
    //     replyToken, contents["menu-count-ctt"]
    //   );
    // }
    case 'นับลูกดิ้นแบบ count to ten':
      return client.replyMessage(
        replyToken, contents["menu-count-ctt-start"]
      );
    case 'นับลูกดิ้นแบบ sadovsky':
      // return client.replyMessage(
      //   replyToken, contents["menu-count-sadovsky-start"]
      // );
      let h = getHours()
      // check time must not exceed 4-8 o'clock
      if (inRange(h, 4, 21)) {
        return client.replyMessage(
          replyToken, contents["menu-count-sadovsky-start"]
        );
      } else {
        return replyText(replyToken, "ไม่ได้อยู่ในช่วงอะ")
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
    case 'ท่านั่งจับปลายเท้า':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-1"]
      )
    case 'ท่านั่งยกมือดันอากาศ':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-2"]
      )
    case 'ท่าโก่งหลัง':
      return client.replyMessage(
        replyToken, contents["menu-manual-4-3"]
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
    case 'ระบบทางเดินอาหาร': // manual 7-1
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1"]
      )
    case 'คลื่นไส้ อาเจียน':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-1"]
      )
    case 'มีน้ำลายมาก':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-2"]
      )
    case 'เหงือกอักเสบ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-3"]
      )
    case 'ร้อนในอก':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-4"]
      )
    case 'ท้องผูก':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-5"]
      )
    case 'ริดสีดวงทวาร':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-1-6"]
      )
    case 'ระบบหัวใจและหลอดเลือด': // manual 7-2
      return client.replyMessage(
        replyToken, contents["menu-manual-7-2"]
      )
    case 'ใจสั่น เป็นลม':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-2-1"]
      )
    case 'เส้นเลือดขอด':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-2-2"]
      )
    case 'ระบบหายใจ': // manual 7-3
      return client.replyMessage(
        replyToken, contents["menu-manual-7-3"]
      )
    case 'หายใจลำบาก':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-3-1"]
      )
    case 'ระบบกระดูกและกล้ามเนื้อ': // manual 7-4
      return client.replyMessage(
        replyToken, contents["menu-manual-7-4"]
      )
    case 'ตะคริว':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-4-1"]
      )
    case 'ปวดหลัง':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-4-2"]
      )
    case 'ระบบขับถ่ายปัสสาวะ': // manual 7-5
      return client.replyMessage(
        replyToken, contents["menu-manual-7-5"]
      )
    case 'ปัสสาวะบ่อย':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-5-1"]
      )
    case 'ระบบผิวหนัง': // manual 7-6
      return client.replyMessage(
        replyToken, contents["menu-manual-7-6"]
      )
    case 'ผิวหนังเปลี่ยนแปลง':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-6-1"]
      )
    case 'ระบบประสาท': // manual 7-7
      return client.replyMessage(
        replyToken, contents["menu-manual-7-7"]
      )
    case 'ปวดศีรษะ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-7-1"]
      )
    case 'อารมณ์แปรปรวน':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-7-2"]
      )
    case 'ปวด ชาฝ่ามือและนิ้วมือ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-7-3"]
      )
    case 'อาการอื่นๆ': // manual 7-8
      return client.replyMessage(
        replyToken, contents["menu-manual-7-8"]
      )
    case 'เท้าและข้อบวม':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-8-1"]
      )
    case 'นอนไม่หลับ':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-8-2"]
      )
    case 'อ่อนเพลีย':
      return client.replyMessage(
        replyToken, contents["menu-manual-7-8-3"]
      )
    case 'สัญญาณอันตรายที่อาจเกิดขึ้นได้ในระยะตั้งครรภ์': // manual 8
      return client.replyMessage(
        replyToken, contents["menu-manual-8"]
      )
    case 'สัญญาณอันตรายในไตรมาสที่ 1':
      return client.replyMessage(
        replyToken, contents["menu-manual-8-1"]
      )
    case 'สัญญาณอันตรายในไตรมาสที่ 2':
      return client.replyMessage(
        replyToken, contents["menu-manual-8-2"]
      )
    case 'สัญญาณอันตรายในไตรมาสที่ 3':
      return client.replyMessage(
        replyToken, contents["menu-manual-8-3"]
      )
    case 'การเตรียมตัวคลอด': // manual 9
      return replyText(replyToken, contents["menu-manual-9"]["msg"]);
    case 't':
      let x = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
      x = new Date(x).toString();
      return replyText(replyToken, x);
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
  }
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken, contents["default-sticker"]
  );
}

function getHours() {
  let time = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
  time = new Date(time).getHours();

  return time
}

function inRange(value, min, max) {
  return ((value - min) * (value - max) <= 0);
}

// listen on port
const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
