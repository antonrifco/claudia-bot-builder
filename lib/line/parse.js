'use strict';

module.exports = function(messageObject) {
  if (messageObject && messageObject.type && messageObject.replyToken && messageObject.source && messageObject.message && messageObject.message.text ) {
    return {
      replyToken: messageObject.replyToken,
      sender: messageObject.source.userId || messageObject.source.groupId || messageObject.source.roomId,
      text: messageObject.message.text,
      originalRequest: messageObject,
      type: 'line'
    };
  } else if (messageObject && messageObject.type && messageObject.replyToken && messageObject.source && messageObject.postback && messageObject.postback.data) {
    return {
      replyToken: messageObject.replyToken,
      sender: messageObject.source.userId || messageObject.source.groupId || messageObject.source.roomId,
      text: messageObject.postback.data,
      originalRequest: messageObject,
      postback: true,
      type: 'line'
    };
  } else if (messageObject && messageObject.type && messageObject.source) {
    const parsed = {
      sender: messageObject.source.userId || messageObject.source.groupId || messageObject.source.roomId,
      text: (messageObject.message && messageObject.message.text) || '',
      originalRequest: messageObject,
      type: 'line'
    };

    if (messageObject.replyToken) {
      parsed.replyToken = messageObject.replyToken;
    }

    return parsed;
  }
};
