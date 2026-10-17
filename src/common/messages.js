/**
 * WebExtensions cross-context messaging helpers.
 */

/**
 * Creates a standard message envelope.
 * @param {string} type
 * @param {any} [payload]
 * @param {'background' | 'content' | 'popup'} [sender]
 */
export function createMessage(type, payload = null, sender = undefined) {
  return {
    type,
    payload,
    sender,
    timestamp: Date.now()
  };
}

/**
 * Sends a message from content or popup script to the background script.
 * @param {string} type
 * @param {any} [payload]
 * @returns {Promise<any>}
 */
export async function sendMessageToBackground(type, payload = null) {
  const msg = createMessage(type, payload);
  if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) {
    return browser.runtime.sendMessage(msg);
  }
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
  console.warn('[SimpleAloud] No extension runtime available to send message to background');
  return null;
}

/**
 * Sends a message from background script to a specific browser tab.
 * @param {number} tabId
 * @param {string} type
 * @param {any} [payload]
 * @returns {Promise<any>}
 */
export async function sendMessageToTab(tabId, type, payload = null) {
  const msg = createMessage(type, payload, 'background');
  if (typeof browser !== 'undefined' && browser.tabs && browser.tabs.sendMessage) {
    return browser.tabs.sendMessage(tabId, msg);
  }
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.sendMessage) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, msg, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
  return null;
}

/**
 * Attaches a runtime message listener.
 * @param {(message: any, sender: any, sendResponse: Function) => boolean | Promise<any> | void} handler
 */
export function addMessageListener(handler) {
  if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
    browser.runtime.onMessage.addListener(handler);
    return;
  }
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(handler);
    return;
  }
}
