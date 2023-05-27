import { EventEmitter } from 'node:events';
import WebSocket from 'ws';
import logger from '@wdio/logger';
const log = logger('webdriver:BidiHandler');
const RESPONSE_TIMEOUT = 1000 * 60;
export class BidiHandler extends EventEmitter {
    _webSocketUrl;
    #id = 0;
    #ws;
    #isConnected = false;
    constructor(_webSocketUrl) {
        super();
        this._webSocketUrl = _webSocketUrl;
        log.info(`Connect to webSocketUrl ${this._webSocketUrl}`);
        this.#ws = new WebSocket(this._webSocketUrl);
    }
    connect() {
        return new Promise((resolve) => this.#ws.on('open', () => {
            this.#isConnected = true;
            resolve();
        }));
    }
    get socket() {
        return this.#ws;
    }
    get isConnected() {
        return this.#isConnected;
    }
    send(params) {
        if (!this.#isConnected) {
            throw new Error('No connection to WebDriver Bidi was established');
        }
        const id = ++this.#id;
        this.#ws.send(JSON.stringify({ id, ...params }));
        return new Promise((resolve, reject) => {
            const t = setTimeout(() => {
                reject(new Error(`Request with id ${id} timed out`));
                h.off('message', listener);
            }, RESPONSE_TIMEOUT);
            const listener = (data) => {
                try {
                    const payload = JSON.parse(data.toString());
                    if (payload.id === id) {
                        clearTimeout(t);
                        h.off('message', listener);
                        resolve(payload);
                    }
                }
                catch (err) {
                    log.error(`Failed parse message: ${err.message}`);
                }
            };
            const h = this.#ws.on('message', listener);
        });
    }
    sendAsync(params) {
        if (!this.#isConnected) {
            throw new Error('No connection to WebDriver Bidi was established');
        }
        const id = ++this.#id;
        this.#ws.send(JSON.stringify({ id, ...params }));
    }
}
