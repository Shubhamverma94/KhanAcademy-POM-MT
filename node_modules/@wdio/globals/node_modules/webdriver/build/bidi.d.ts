/// <reference types="node" />
import { EventEmitter } from 'node:events';
import WebSocket from 'ws';
import type { BidiRequest, BidiResponse } from '@wdio/protocols';
export declare class BidiHandler extends EventEmitter {
    #private;
    private _webSocketUrl;
    constructor(_webSocketUrl: string);
    connect(): Promise<void>;
    get socket(): WebSocket;
    get isConnected(): boolean;
    send(params: BidiRequest): Promise<BidiResponse>;
    sendAsync(params: BidiRequest): void;
}
//# sourceMappingURL=bidi.d.ts.map