import { onActivated } from './onActivated';
import { onInstalled } from './onInstalled';
import { onMessage } from './onMessage';
import { onStartup } from './onStartup';
import { onUpdated } from './onUpdated';

chrome.runtime.onInstalled.addListener(onInstalled);

chrome.runtime.onMessage.addListener(onMessage);

chrome.tabs.onUpdated.addListener(onUpdated);

chrome.runtime.onStartup.addListener(onStartup);

chrome.tabs.onActivated.addListener(onActivated);
