'use strict';

const isUrl = require('../is-url');

function isNumber(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

/**
 * https://devdocs.line.me/en/#send-message-object
 */

class LineMessage {
  constructor() {
    this.message = {};
  }

  get() {
    return this.message;
  }
}

class Text extends LineMessage {
  constructor(text) {
    super();

    if (!text || typeof text !== 'string')
      throw new Error('Text is required for text message');

    if (text.length > 2000)
      throw new Error('Text can not be more than 2000 characters');

    this.message = {
      type: 'text',
      text: text
    };
  }
}

class Image extends LineMessage {
  constructor(originalContentUrl, previewImageUrl) {
    super();

    if (!originalContentUrl || !isUrl(originalContentUrl))
      throw new Error('Image message required a valid URL as a first parameter');

    if (originalContentUrl && originalContentUrl.length > 1000)
      throw new Error('OriginalContentUrl can not be more than 1000 characters');

    if (previewImageUrl && !isUrl(previewImageUrl))
      throw new Error('Image message required a valid URL as a second parameter');

    if (previewImageUrl && previewImageUrl.length > 1000)
      throw new Error('PreviewImageUrl can not be more than 1000 characters');

    if (!previewImageUrl) {
      previewImageUrl = originalContentUrl;
    }

    this.message = {
      type: 'image',
      originalContentUrl: originalContentUrl,
      previewImageUrl: previewImageUrl
    };
  }
}

class Video extends LineMessage {
  constructor(originalContentUrl, previewImageUrl) {
    super();

    if (!originalContentUrl || !isUrl(originalContentUrl))
      throw new Error('Video message required a valid URL as a first parameter');

    if (originalContentUrl && originalContentUrl.length > 1000)
      throw new Error('OriginalContentUrl can not be more than 1000 characters');

    if (!previewImageUrl || !isUrl(previewImageUrl))
      throw new Error('Video message required a valid URL as a second parameter');

    if (previewImageUrl && previewImageUrl.length > 1000)
      throw new Error('PreviewImageUrl can not be more than 1000 characters');

    this.message = {
      type: 'video',
      originalContentUrl: originalContentUrl,
      previewImageUrl: previewImageUrl
    };
  }
}

class Audio extends LineMessage {
  constructor(originalContentUrl, duration) {
    super();

    if (!originalContentUrl || !isUrl(originalContentUrl))
      throw new Error('Audio message required a valid URL as a first parameter');

    if (originalContentUrl && originalContentUrl.length > 1000)
      throw new Error('OriginalContentUrl can not be more than 1000 characters');

    if (!isNumber(duration))
      throw new Error('Audio message required a valid duration as a second parameter');

    this.message = {
      type: 'audio',
      originalContentUrl: originalContentUrl,
      duration: duration
    };
  }
}

class Location extends LineMessage {
  constructor(title, address, latitude, longitude) {
    super();

    if (!title || typeof title !== 'string')
      throw new Error('Location message required a title as a first parameter');

    if (title && title.length > 100)
      throw new Error('Title can not be more than 100 characters');

    if (!address || typeof address !== 'string')
      throw new Error('Location message required an address as a second parameter');

    if (address && address.length > 100)
      throw new Error('Address can not be more than 100 characters');

    if (!isNumber(latitude))
      throw new Error('Location message required a latitude as a third parameter');

    if (!isNumber(longitude))
      throw new Error('Location message required a longitude as a fourth parameter');

    this.message = {
      type: 'location',
      title: title,
      address: address,
      latitude: latitude,
      longitude: longitude
    };
  }
}

class Sticker extends LineMessage {
  constructor(packageId, stickerId) {
    super();

    if (!packageId || typeof packageId !== 'string')
      throw new Error('Sticker message required a packageId as a first parameter');

    if (!stickerId || typeof stickerId !== 'string')
      throw new Error('Sticker message required a stickerId as a second parameter');

    this.message = {
      type: 'sticker',
      packageId: packageId,
      stickerId: stickerId
    };
  }
}

class ImageMap extends LineMessage {
  constructor(baseUrl, width, height, altText) {
    super();

    if (!baseUrl || !isUrl(baseUrl))
      throw new Error('ImageMap message required a valid URL as a first parameter');

    if (baseUrl && baseUrl.length > 1000)
      throw new Error('BaseUrl can not be more than 1000 characters');

    if (!isNumber(width))
      throw new Error('ImageMap message required a width as an second parameter');

    if (!isNumber(height))
      throw new Error('ImageMap message required a height as a third parameter');

    if (!altText || typeof altText !== 'string')
      throw new Error('ImageMap message required an altText as a fourth parameter');

    if (altText && altText.length > 400)
      throw new Error('AltText can not be more than 400 characters');

    this.message = {
      type: 'imagemap',
      baseUrl: baseUrl,
      altText: altText,
      baseSize: {
        height: height,
        width: width
      }
    };
    this.actions = [];
  }

  addAction(action) {
    if (!action)
      throw new Error('Action is required for addAction');

    const area = action.area;
    if (!area || !isNumber(area.x) || !isNumber(area.y) || !isNumber(area.width) || !isNumber(area.height))
      throw new Error('A valid area is required for an action');

    if (this.actions.length === 50)
      throw new Error('There can not be more than 50 actions');

    this.actions.push(action);

    return this;
  }

  addUriAction(linkUri, area) {
    if (!linkUri || !isUrl(linkUri))
      throw new Error('LinkUri has a bad url');

    if (linkUri && linkUri.length > 1000)
      throw new Error('LinkUri can not be more than 1000 characters');

    return this.addAction({
      type: 'uri',
      linkUri: linkUri,
      area: area
    });
  }

  addMessageAction(text, area) {
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for a message action');

    if (text && text.length > 400)
      throw new Error('Text can not be more than 400 characters');

    return this.addAction({
      type: 'message',
      text: text,
      area: area
    });
  }

  get() {
    if (!this.actions || !this.actions.length)
      throw new Error('Add at least one action first!');

    this.message.actions = this.actions;

    return this.message;
  }
}

class Template extends LineMessage {
  constructor() {
    super();

    this.actions = [];
  }

  addAction(action) {
    const type = this.message.template.type;
    if (type === 'buttons' && this.actions.length >= 4)
      throw new Error('There can not be more than 4 actions');

    if (type === 'confirm' && this.actions.length >= 2)
      throw new Error('There can not be more than 2 actions');

    this.actions.push(action);
    return this;
  }

  addMessageAction(label, text) {
    if (!label || typeof label !== 'string')
      throw new Error('Action required a label as a first parameter');

    if (label && label.length > 20)
      throw new Error('Label can not be more than 20 characters');

    if (!text || typeof text !== 'string')
      throw new Error('Action required a text as a second parameter');

    if (text && text.length > 300)
      throw new Error('Text can not be more than 300 characters');

    const action = {
      type: 'message',
      label: label,
      text: text
    };

    return this.addAction(action);
  }

  addPostbackAction(label, data, text) {
    if (!label || typeof label !== 'string')
      throw new Error('Postback action required a label as a first parameter');

    if (label && label.length > 20)
      throw new Error('Label can not be more than 20 characters');

    if (!data || typeof data !== 'string')
      throw new Error('Postback action required a data as a second parameter');

    if (data && data.length > 300)
      throw new Error('Data can not be more than 300 characters');

    if (text && typeof text !== 'string')
      throw new Error('Text needs to be a string');

    if (text && text.length > 300)
      throw new Error('Text can not be more than 300 characters');

    const action = {
      type: 'postback',
      label: label,
      data: data
    };

    if (text)
      action.text = text;

    return this.addAction(action);
  }

  addUriAction(label, uri) {
    if (!label || typeof label !== 'string')
      throw new Error('Action required a label as a first parameter');

    if (label && label.length > 20)
      throw new Error('Label can not be more than 20 characters');

    if (!uri || !isUrl(uri))
      throw new Error('Action required a uri as a second parameter');

    if (uri && uri.length > 1000)
      throw new Error('Uri can not be more than 1000 characters');

    const action = {
      type: 'uri',
      label: label,
      uri: uri
    };

    return this.addAction(action);
  }

  get() {
    if (!this.actions || !this.actions.length)
      throw new Error('Add at least one action first!');

    this.message.template.actions = this.actions;

    return this.message;
  }
}

class Button extends Template {
  constructor(text, altText) {
    super();

    if (!text || typeof text !== 'string')
      throw new Error('Button message required a text as a first parameter');

    if (text && text.length > 160)
      throw new Error('Text can not be more than 160 characters');

    if (!altText || typeof altText !== 'string')
      throw new Error('Button message required an altText as a fourth parameter');

    if (altText && altText.length > 400)
      throw new Error('AltText can not be more than 400 characters');

    this.message = {
      type: 'template',
      altText: altText,
      template: {
        type: 'buttons',
        text: text
      }
    };
  }

  addTitle(title) {
    if (!title || typeof title !== 'string')
      throw new Error('Title is required for addTitle');

    if (title && title.length > 40)
      throw new Error('Title can not be more than 40 characters');

    if (this.message.template.text && this.message.template.text.length > 60)
      throw new Error('Text can not be more than 40 characters when with an image or title');

    this.message.template.title = title;
    return this;
  }

  addImage(thumbnailImageUrl) {
    if (!thumbnailImageUrl || typeof thumbnailImageUrl !== 'string')
      throw new Error('ThumbnailImageUrl is required for addthumbnailImageUrl');

    if (thumbnailImageUrl && thumbnailImageUrl.length > 1000)
      throw new Error('ThumbnailImageUrl can not be more than 1000 characters');

    if (this.message.template.text && this.message.template.text.length > 60)
      throw new Error('Text can not be more than 40 characters when with an image or title');

    this.message.template.thumbnailImageUrl = thumbnailImageUrl;
    return this;
  }
}

class Confirm extends Template {
  constructor(text, altText) {
    super();

    if (!text || typeof text !== 'string')
      throw new Error('Confirm message required a text as a first parameter');

    if (text && text.length > 240)
      throw new Error('Text can not be more than 240 characters');

    if (!altText || typeof altText !== 'string')
      throw new Error('Confirm message required an altText as a fourth parameter');

    if (altText && altText.length > 400)
      throw new Error('AltText can not be more than 400 characters');

    this.message = {
      type: 'template',
      altText: altText,
      template: {
        type: 'confirm',
        text: text
      }
    };
  }
}

class Carousel extends Template {
  constructor(altText) {
    super();

    if (!altText || typeof altText !== 'string')
      throw new Error('Carousel message required an altText as a first parameter');

    if (altText && altText.length > 400)
      throw new Error('AltText can not be more than 400 characters');

    this.columns = [];
    this.message = {
      type: 'template',
      altText: altText,
      template: {
        type: 'carousel'
      }
    };
  }

  getLastColumn() {
    if (!this.columns || !this.columns.length)
      throw new Error('Add at least one column first!');

    return this.columns[this.columns.length - 1];
  }

  addColumn(text) {
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for addColumn');

    if (text && text.length > 120)
      throw new Error('Text can not be more than 120 characters');

    if (this.columns.length === 5)
      throw new Error('There can not be more than 5 columns');

    this.columns.push({
      text: text,
      actions: []
    });

    return this;
  }

  addImage(url) {
    const lastColumn = this.getLastColumn();

    if (!url || !isUrl(url))
      throw new Error('Image has a bad url');

    if (url && url.length > 1000)
      throw new Error('Url can not be more than 1000 characters');

    if (lastColumn.text && lastColumn.text.length > 60)
      throw new Error('Text can not be more than 40 characters when with an image or title');

    lastColumn.thumbnailImageUrl = url;

    return this;
  }

  addTitle(title) {
    const lastColumn = this.getLastColumn();

    if (!title || typeof title !== 'string')
      throw new Error('Title is required for addTitle');

    if (title && title.length > 40)
      throw new Error('Title can not be more than 40 characters');

    if (lastColumn.text && lastColumn.text.length > 60)
      throw new Error('Text can not be more than 40 characters when with an image or title');

    lastColumn.title = title;

    return this;
  }

  addAction(action) {
    const lastColumn = this.getLastColumn();

    if (lastColumn.actions.length === 3)
      throw new Error('There can not be more than 3 actions in a column');

    lastColumn.actions.push(action);

    return this;
  }

  get() {
    if (!this.columns || !this.columns.length)
      throw new Error('Add at least one column first!');

    this.message.template.columns = this.columns;

    return this.message;
  }
}

module.exports = {
  Text: Text,
  Image: Image,
  Video: Video,
  Audio: Audio,
  Location: Location,
  Sticker: Sticker,
  ImageMap: ImageMap,
  Button: Button,
  Confirm: Confirm,
  Carousel: Carousel
};