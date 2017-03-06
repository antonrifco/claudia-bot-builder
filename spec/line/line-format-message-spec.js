/*global describe, it, expect, beforeEach, require */
'use strict';

const formatLineMessage = require('../../lib/line/format-message');

describe('Line format message', () => {
  it('should export an object', () => {
    expect(typeof formatLineMessage).toBe('object');
  });

  describe('Text', () => {
    it('should be a class', () => {
      const message = new formatLineMessage.Text('text');
      expect(typeof formatLineMessage.Text).toBe('function');
      expect(message instanceof formatLineMessage.Text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatLineMessage.Text()).toThrowError('Text is required for text template');
    });

    it('should add a text', () => {
      const message = new formatLineMessage.Text('Some text').get();
      expect(message.text).toBe('Some text');
    });

    it('should return a simple text object', () => {
      const message = new formatLineMessage.Text('Some text');
      expect(message.get()).toEqual({
        text: 'Some text'
      });
    });

    
  });

  describe('Generic template', () => {
    let generic;

    beforeEach(() => {
      generic = new formatLineMessage.Generic();
    });

    it('should be a class', () => {
      expect(typeof formatLineMessage.Generic).toBe('function');
      expect(generic instanceof formatLineMessage.Generic).toBeTruthy();
    });

    it('should throw an error if at least one bubble/element is not added', () => {
      expect(() => generic.get()).toThrowError('Add at least one bubble first!');
    });

    it('should throw an error if bubble title does not exist', () => {
      expect(() => generic.addBubble()).toThrowError('Bubble title cannot be empty');
    });

    it('should throw an error if bubble title is too long', () => {
      expect(() => generic.addBubble('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble title cannot be longer than 80 characters');
    });

    it('should throw an error if bubble subtitle is too long', () => {
      expect(() => generic.addBubble('Test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble subtitle cannot be longer than 80 characters');
    });

    it('should add a bubble with a provided title', () => {
      generic.addBubble('Test');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test');
    });

    it('should add a bubble with a provided title and subtitle', () => {
      generic.addBubble('Test Title', 'Test Subtitle');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test Title');
      expect(generic.bubbles[0].subtitle).toBe('Test Subtitle');
    });

    it('should throw an error if you try to add an url but not provide it', () => {
      generic.addBubble('Test');

      expect(() => generic.addUrl()).toThrowError('URL is required for addUrl method');
    });

    it('should throw an error if you try to add an url in invalid format', () => {
      generic.addBubble('Test');

      expect(() => generic.addUrl('http//invalid-url')).toThrowError('URL needs to be valid for addUrl method');
    });

    it('should add an url if it is valid', () => {
      generic
        .addBubble('Test')
        .addUrl('http://google.com');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].item_url).toBe('http://google.com');
    });

    it('should throw an error if you try to add an image but not provide an url', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage()).toThrowError('Image URL is required for addImage method');
    });

    it('should throw an error if you try to add an image, but url is in invalid format', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage('http//invalid-url')).toThrowError('Image URL needs to be valid for addImage method');
    });

    it('should add an image if it is valid', () => {
      generic
        .addBubble('Test')
        .addImage('http://google.com/path/to/image.png');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should throw an error if you add a button without the title', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton('Title')).toThrowError('Button value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 1);

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('postback');
      expect(generic.bubbles[0].buttons[0].payload).toBe(1);
      expect(generic.bubbles[0].buttons[0].url).not.toBeDefined();
    });

    it('should add a button with a share url', () => {
      generic
        .addBubble('Test')
        .addShareButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
    });

    it('should add a button with title and url if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 'http://google.com');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('web_url');
      expect(generic.bubbles[0].buttons[0].url).toBe('http://google.com');
      expect(generic.bubbles[0].buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      generic
        .addBubble('Test')
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(generic.bubbles[0].buttons.length).toBe(3);
      expect(generic.bubbles[0].buttons[0].title).toBe('b1');
      expect(generic.bubbles[0].buttons[0].payload).toBe('v1');
      expect(generic.bubbles[0].buttons[1].title).toBe('b2');
      expect(generic.bubbles[0].buttons[1].payload).toBe('v2');
      expect(generic.bubbles[0].buttons[2].title).toBe('b3');
      expect(generic.bubbles[0].buttons[2].payload).toBe('v3');
    });

    it('should throw an error if call button is added with wrong phone format', () => {
      generic.addBubble('Test');
      expect(() => generic.addCallButton('Title')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', 123)).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', 'abc')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', '+123')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
    });

    it('should add a call button', () => {
      generic.addBubble('Test')
        .addCallButton('Button 1', '+123456789');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Button 1');
      expect(generic.bubbles[0].buttons[0].payload).toBe('+123456789');
      expect(generic.bubbles[0].buttons[0].type).toBe('phone_number');
    });

    it('should add a share button', () => {
      generic.addBubble('Test')
        .addShareButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
    });

    it('should add a share button with share content', () => {
      const shareContent = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: `I took Peter's "Which Hat Are You?" Quiz`,
                subtitle: 'My result: Fez',
                image_url: 'https//bot.peters-hats.com/img/hats/fez.jpg',
                default_action: {
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601'
                },
                buttons: [{
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601',
                  title: 'Take Quiz'
                }]
              }
            ]
          }
        }
      };
      generic.addBubble('Test')
        .addShareButton(shareContent);

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
      expect(generic.bubbles[0].buttons[0].share_contents).toEqual(shareContent);
    });

    it('should throw an error if all arguments are not provided for buy button', () => {
      generic.addBubble('Test');

      expect(() => generic.addBuyButton()).toThrowError('Button value is required');
      expect(() => generic.addBuyButton('Title')).toThrowError('Button value is required');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD')).toThrowError('Payment summary is required for buy button');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD', 123)).toThrowError('Payment summary is required for buy button');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD', 'abc')).toThrowError('Payment summary is required for buy button');
    });

    it('should add a buy button', () => {
      generic.addBubble('Test')
        .addBuyButton('Buy', 'BUY_PAYLOAD', {
          additionalOptions: true
        });

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Buy');
      expect(generic.bubbles[0].buttons[0].type).toBe('payment');
      expect(generic.bubbles[0].buttons[0].payload).toBe('BUY_PAYLOAD');
      expect(generic.bubbles[0].buttons[0].payment_summary).toEqual({
        additionalOptions: true
      });
    });

    it('should throw an error if url provided for login button is not valid', () => {
      generic.addBubble('Test');

      expect(() => generic.addLoginButton()).toThrowError('Valid URL is required for Login button');
      expect(() => generic.addLoginButton('123')).toThrowError('Valid URL is required for Login button');
    });

    it('should add a login button', () => {
      generic.addBubble('Test')
        .addLoginButton('https://example.com');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('account_link');
      expect(generic.bubbles[0].buttons[0].url).toBe('https://example.com');
    });

    it('should add a logout button', () => {
      generic.addBubble('Test')
        .addLogoutButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('account_unlink');
    });

    it('should throw an error if you add more than 3 buttons', () => {
      generic
        .addBubble('Test');

      expect(() => {
        generic
          .addButton('Title 1', 1)
          .addButton('Title 2', 2)
          .addButton('Title 3', 3)
          .addButton('Title 4', 4);
      }).toThrowError('3 buttons are already added and that\'s the maximum');
    });

    it('should throw an error if there\'s more than 10 bubbles', () => {
      expect(() =>
        generic
          .addBubble('1', 'hello')
          .addBubble('2', 'hello')
          .addBubble('3', 'hello')
          .addBubble('4', 'hello')
          .addBubble('5', 'hello')
          .addBubble('6', 'hello')
          .addBubble('7', 'hello')
          .addBubble('8', 'hello')
          .addBubble('9', 'hello')
          .addBubble('10', 'hello')
          .addBubble('11', 'hello')
      )
      .toThrowError('10 bubbles are maximum for Generic template');
    });

    it('should return a formated object in the end', () => {
      expect(
        generic
          .addBubble('Title')
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Title'
            }]
          }
        }
      });
    });
  });

  describe('Button template', () => {
    it('should be a class', () => {
      let button = new formatLineMessage.Button('Test');

      expect(typeof formatLineMessage.Button).toBe('function');
      expect(button instanceof formatLineMessage.Button).toBeTruthy();
    });

    it('should throw an error if button text is not provided', () => {
      expect(() => new formatLineMessage.Button()).toThrowError('Button template text cannot be empty');
    });

    it('should throw an error if button text is longer than 640 characters', () => {
      expect(() => new formatLineMessage.Button(Array(641).fill('x').join(''))).toThrowError('Button template text cannot be longer than 640 characters');
    });

    it('should create a button template with the text when valid text is provided', () => {
      let button = new formatLineMessage.Button('Test');

      expect(button.template.attachment.payload.text).toBe('Test');
    });

    it('should throw an error if you add a button without the title', () => {
      let button = new formatLineMessage.Button('Test');

      expect(() => button.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      let button = new formatLineMessage.Button('Test');

      expect(() => button.addButton('Title')).toThrowError('Button value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      let button = new formatLineMessage.Button('Test');
      button.addButton('Title 1', 1);

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Title 1');
      expect(button.template.attachment.payload.buttons[0].type).toBe('postback');
      expect(button.template.attachment.payload.buttons[0].payload).toBe(1);
      expect(button.template.attachment.payload.buttons[0].url).not.toBeDefined();
    });

    it('should add a button with title and url if you pass valid format', () => {
      let button = new formatLineMessage.Button('Test');
      button.addButton('Title 1', 'http://google.com');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Title 1');
      expect(button.template.attachment.payload.buttons[0].type).toBe('web_url');
      expect(button.template.attachment.payload.buttons[0].url).toBe('http://google.com');
      expect(button.template.attachment.payload.buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      const button = new formatLineMessage.Button('Test');
      button
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(button.template.attachment.payload.buttons.length).toBe(3);
      expect(button.template.attachment.payload.buttons[0].title).toBe('b1');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('v1');
      expect(button.template.attachment.payload.buttons[1].title).toBe('b2');
      expect(button.template.attachment.payload.buttons[1].payload).toBe('v2');
      expect(button.template.attachment.payload.buttons[2].title).toBe('b3');
      expect(button.template.attachment.payload.buttons[2].payload).toBe('v3');
    });

    it('should throw an error if call button is added with wrong phone format', () => {
      const button = new formatLineMessage.Button('Test');
      expect(() => button.addCallButton('Title')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', 123)).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', 'abc')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', '+123')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
    });

    it('should add a call button', () => {
      const button = new formatLineMessage.Button('Test')
        .addCallButton('Button 1', '+123456789');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Button 1');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('+123456789');
      expect(button.template.attachment.payload.buttons[0].type).toBe('phone_number');
    });

    it('should add a share button', () => {
      const button = new formatLineMessage.Button('Test')
        .addShareButton();

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('element_share');
    });

    it('should add a share button with share content', () => {
      const shareContent = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: `I took Peter's "Which Hat Are You?" Quiz`,
                subtitle: 'My result: Fez',
                image_url: 'https//bot.peters-hats.com/img/hats/fez.jpg',
                default_action: {
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601'
                },
                buttons: [{
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601',
                  title: 'Take Quiz'
                }]
              }
            ]
          }
        }
      };
      const button = new formatLineMessage.Button('Test')
        .addShareButton(shareContent);

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('element_share');
      expect(button.template.attachment.payload.buttons[0].share_contents).toEqual(shareContent);
    });

    it('should throw an error if all arguments are not provided for buy button', () => {
      const button = new formatLineMessage.Button('Test');

      expect(() => button.addBuyButton()).toThrowError('Button value is required');
      expect(() => button.addBuyButton('Title')).toThrowError('Button value is required');
      expect(() => button.addBuyButton('Title', 'PAYLOAD')).toThrowError('Payment summary is required for buy button');
      expect(() => button.addBuyButton('Title', 'PAYLOAD', 123)).toThrowError('Payment summary is required for buy button');
      expect(() => button.addBuyButton('Title', 'PAYLOAD', 'abc')).toThrowError('Payment summary is required for buy button');
    });

    it('should add a buy button', () => {
      const button = new formatLineMessage.Button('Test')
        .addBuyButton('Buy', 'BUY_PAYLOAD', {
          additionalOptions: true
        });

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Buy');
      expect(button.template.attachment.payload.buttons[0].type).toBe('payment');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('BUY_PAYLOAD');
      expect(button.template.attachment.payload.buttons[0].payment_summary).toEqual({
        additionalOptions: true
      });
    });

    it('should throw an error if url provided for login button is not valid', () => {
      const button = new formatLineMessage.Button('Test');

      expect(() => button.addLoginButton()).toThrowError('Valid URL is required for Login button');
      expect(() => button.addLoginButton('123')).toThrowError('Valid URL is required for Login button');
    });

    it('should add a login button', () => {
      const button = new formatLineMessage.Button('Test')
        .addLoginButton('https://example.com');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('account_link');
      expect(button.template.attachment.payload.buttons[0].url).toBe('https://example.com');
    });

    it('should add a logout button', () => {
      const button = new formatLineMessage.Button('Test')
        .addLogoutButton();

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('account_unlink');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatLineMessage.Button('Test')
          .addButton('Title 1', 1)
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Test',
            buttons: [{
              type: 'postback',
              title: 'Title 1',
              payload: 1
            }]
          }
        }
      });
    });
  });

  describe('Image attachment', () => {
    it('should be a class', () => {
      let image = new formatLineMessage.Image('http://google.com');

      expect(typeof formatLineMessage.Image).toBe('function');
      expect(image instanceof formatLineMessage.Image).toBeTruthy();
    });

    it('should throw an error if you add an image without the url', () => {
      expect(() => new formatLineMessage.Image()).toThrowError('Image template requires a valid URL as a first parameter');
    });

    it('should throw an error if you add an image with invalid url', () => {
      expect(() => new formatLineMessage.Image('google')).toThrowError('Image template requires a valid URL as a first parameter');
    });

    it('should add an image with given URL if URL is valid', () => {
      let image = new formatLineMessage.Image('http://google.com/path/to/image.png');

      expect(image.template.attachment.payload.url).toEqual('http://google.com/path/to/image.png');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatLineMessage.Image('http://google.com/path/to/image.png').get()
      ).toEqual({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://google.com/path/to/image.png'
          }
        }
      });
    });
  });
});
