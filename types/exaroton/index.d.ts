// Type definitions for exaroton 1.7
// Project: https://github.com/exaroton/node-exaroton-api
// Definitions by: Maximilian Hofmann <https://github.com/hofmmaxi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import FormData = require('form-data');

// Exported types
export { Client, Request, Response, Server, Software };
declare class Client {
    protocol: string | 'https';

    host: string | 'api.exaroton.com';

    basePath: string | '/v1';

    /**
     * API base URL used for all requests
     */
    get baseUrl(): string;

    /**
     * API token used for authentication
     */
    private apiToken: string | null;

    /**
     * User agent sent with all requests
     */
    private userAgent: string;

    /**
     *
     * @param apiToken string API token, create one here: https://exaroton.com/account/
     */
    constructor(apiToken: string);

    /**
     * Set the API token
     *
     * @param apiToken
     */
    setAPIToken(apiToken: string): string;

    getAPIToken(): string;

    /**
     * Set the user agent
     *
     * @param userAgent
     */
    setUserAgent(userAgent: string): Client;

    /**
     * Send a {Request} to the API and get a {Response}
     *
     * @param request
     * @throws {RequestError}
     */
    request(request: Request): Promise<Response>;

    /**
     * Get a list of all servers
     * @throws {RequestError}
     */
    getServers(): Promise<Server[]>;

    /**
     * Get account info for the current account
     *
     * @throws {RequestError}
     */
    getAccount(): Promise<Account>;

    /**
     * Initialize a new server object
     *
     * @param id
     */
    server(id: string): Server;
}

declare class Request {
    /**
     * Request method, e.g. "GET" or "POST"
     */
    method: Method;

    /**
     * Endpoint URL, without base, version or starting /
     */
    endpoint: string;

    /**
     * URL parameters, which are replaced in the endpoint string
     */
    parameters: object;

    /**
     * HTTP request headers
     */
    headers: object;

    /**
     * Post body data
     */
    data: null | object;

    /**
     * Response class used to create/parse responses to this request
     */
    responseClass: Response;

    /**
     * Set a URL parameter
     *
     * URL parameters replace {key} variables in the endpoint URL
     *
     * @param key
     * @param value
     */
    setParameter(key: string, value: string): void;

    /**
     *
     * @param key
     * @param value
     */
    setHeader(key: string, value: string): void;

    /**
     * Get endpoint with replaced parameters
     */
    getEndpoint(): string;

    /**
     * Check if the request has a body
     */
    hasBody(): boolean;

    /**
     * Get body for request
     */
    getBody(): FormData | string;

    /**
     * Create a response object for this request
     *
     * @param body
     */
    createResponse(body: object): Response;
}

declare class Response {
    request: Request;

    /**
     * (raw/parsed) response body
     */
    body: object;

    /**
     * Request constructor
     *
     * @param request
     */
    constructor(request: Request);

    /**
     * Get the data from the response
     */
    getData(): object | null;

    /**
     * Set the body to this.body and maybe parse content
     *
     * @param body
     */
    setBody(body: object): void;
}

interface Server {
    id: string;
    name: string;
    address: string;
    motd: string;
    status: ServerStatus;
    host: string | null;
    port: number | null;
    shared: boolean;
    software: Software;
    players: PlayerList[];
}

interface Software {
    id: string;
    name: string;
    version: string;
}

declare class Server extends EventEmitter {
    /**
     * Shorthand to get server status constants
     */
    STATUS: {
        OFFLINE: 0;
        ONLINE: 1;
        STARTING: 2;
        STOPPING: 3;
        RESTARTING: 4;
        SAVING: 5;
        LOADING: 6;
        CRASHED: 7;
        PENDING: 8;
        PREPARING: 10;
    };

    private client: Client;

    /**
     * Unique server ID
     */
    id: string;

    /**
     * Server name
     */
    name: string;

    /**
     * Full server address (e.g. example.exaroton.me)
     */
    address: string;

    /**
     * MOTD
     */
    motd: string;

    /**
     * Server status
     * @see ServerStatus
     */
    status: ServerStatus;

    /**
     * Host address, only available if the server is online
     */
    host: string | null;

    /**
     * Server port, only available if the server is online
     */
    port: number | null;

    /**
     * Check if this is an owned or shared server
     */
    shared: false | boolean;

    /**
     * Server software
     */
    software: Software;

    /**
     * Player lists
     */
    private playerLists: PlayerList[];

    /**
     * Server constructor
     *
     * @param client
     * @param id
     */
    constructor(client: Client, id: string);

    getClient(): Server;

    /**
     * Get/update the server info
     *
     * @throws {RequestError}
     */
    get(): Promise<Server>;

    /**
     * Start the server
     *
     * @throws {RequestError}
     */
    start(): Promise<Response>;

    /**
     * Stop the server
     *
     * @throws {RequestError}
     */
    stop(): Promise<Response>;

    /**
     * Restart the server
     *
     * @throws {RequestError}
     */
    restart(): Promise<Response>;

    /**
     * Execute a command in the server console
     *
     * @param command
     */
    executeCommand(command: string): Promise<Response | boolean>;

    /**
     * Get the content of the server logs
     *
     * This is cached and will not return the latest updates immediately.
     */
    getLogs(): Promise<string>;

    /**
     * Upload the content of the server logs to mclo.gs
     *
     * Returns the URL of the logs on mclo.gs
     */
    shareLogs(): Promise<string>;

    /**
     * Get the assigned max server RAM in GB
     */
    getRAM(): Promise<number>;

    /**
     * Set the assigned max server RAM in GB
     *
     * @param ram
     */
    setRAM(ram: number): Promise<Response>;

    /**
     * Get the server MOTD
     */
    getMOTD(): Promise<string>;

    /**
     * Set the server MOTD
     *
     * @param motd
     */
    setMOTD(motd: string): Promise<Response>;

    /**
     * Get a server option
     *
     * @param option
     */
    getOption(option: string): Promise<object | null>;

    /**
     * Set a server option
     *
     * @param option
     * @param value
     */
    setOption(option: string, value: string): Promise<Response>;

    /**
     * Get all player lists available for the server
     */
    getPlayerLists(): Promise<PlayerList[]>;

    /**
     * Get a player list by name
     *
     * @param name
     */
    getPlayerList(name: PlayerListTypes): PlayerList;

    /**
     * Check if the server has one or one of multiple status codes
     *
     * Use this.STATUS.<STATUS> for status codes
     *
     * @param status
     */
    hasStatus(status: number | number[]): boolean;

    /**
     * Get a websocket client for this server
     */
    getWebsocketClient(): WebsocketClient;

    /**
     * Subscribe to one or multiple streams
     *
     * @param streams
     */
    subscribe(streams?: subscriptionTypes[] | subscriptionTypes): boolean;

    /**
     * Unsubscribe from one, multiple or all streams
     *
     * @param streams
     */
    unsubscribe(streams?: subscriptionTypes[] | subscriptionTypes): boolean;

    /**
     * Map raw object to this instance
     *
     * @param server
     */
    setFromObject(server: object): Server;

    /**
     * Only return intended public fields for JSON serialization
     *
     * Otherwise, fields inherited from EventEmitter would be serialized as well
     */
    toJSON(): Server;
}

declare class Software {
    /**
     * Software ID
     */
    id: string;

    /**
     * Software name
     */
    name: string;

    /**
     * Software version
     */
    version: string;

    /**
     * Software constructor
     *
     * @param softwareObject
     */
    constructor(softwareObject: Software);
}

// Internal types
declare class Account {
    private client: Client;

    /**
     * Username
     */
    name: string;

    /**
     * Email address
     */
    email: string;

    /**
     * Email address verification
     */
    verified: boolean;

    /**
     * The amount of credits currently available
     */
    credits: number;

    /**
     * Account constructor
     *
     * @param client
     */
    constructor(client: Client);

    /**
     * Get/update the account info
     *
     * @throws {RequestError}
     */
    get(): Promise<Account>;

    /**
     * Map raw objects to this instance
     *
     * @param account
     */
    setFromObject(account: object): Account;
}

declare class RequestError extends Error {
    statusCode: number;
    response: Response;

    /**
     * Set error and status code from response object
     *
     * Returns if an error message was found
     *
     * @param response
     */
    setErrorFromResponseBody(response: object): boolean;
}

declare class RequestBodyError extends RequestError {
    constructor(response: Response);
}

declare class RequestStatusError extends RequestError {
    constructor(error: RequestError);
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare class GetServersRequest extends Request {
    endpoint: string;
    responseClass: ServersResponse;
}

declare class ServerRequest extends Request {
    /**
     * Server request constructor
     *
     * @param id
     */
    constructor(id: string);
}

declare class ExecuteServerCommandRequest extends ServerRequest {
    endpoint: string;
    method: 'POST';

    /**
     * Server request constructor
     *
     * @param id
     * @param command
     */
    constructor(id: string, command: string);
}

declare class GetServerLogsRequest extends ServerRequest {
    endpoint: string;
}

declare class GetServerOptionRequest extends ServerRequest {
    endpoint: string;

    /**
     * GetServerOptionRequest constructor
     *
     * @param id
     * @param option
     */
    constructor(id: string, option: string);

    /**
     * Set the option name
     *
     * @param option
     */
    setOption(option: string): void;
}

declare class GetServerRequest extends ServerRequest {
    endpoint: string;
}

declare class RestartServerRequest extends ServerRequest {
    endpoint: string;
}

declare class SetServerOptionRequest extends GetServerOptionRequest {
    method: 'POST';

    /**
     * SetServerOptionRequest constructor
     *
     * @param id
     * @param option
     * @param value
     */
    constructor(id: string, option: string, value: any);
}

declare class ShareServerLogsRequest extends ServerRequest {
    endpoint: string;
}

declare class StartServerRequest extends ServerRequest {
    endpoint: string;
}

declare class StopSeversRequest extends ServerRequest {
    endpoint: string;
}

declare class PlayerListRequest extends ServerRequest {
    endpoint: string;
    constructor(id: string, name: string);
}

declare class DeletePlayerListEntriesRequest extends PlayerListRequest {
    method: 'DELETE';
    constructor(id: string, name: string, entries: string);
}

declare class GetPlayerListEntriesRequest extends PlayerListRequest {}

declare class GetPlayerListRequest extends ServerRequest {
    endpoint: string;
    responseClass: PlayerListResponse;
}

declare class PutPlayerListEntriesRequest extends PlayerListRequest {
    method: 'PUT';
    constructor(id: string, name: string, entries: string);
}

declare class GetAccountRequest extends Request {
    endpoint: 'account/' | string;
}

declare class PlayerListResponse extends Response {
    lists: PlayerList[];

    /**
     * @inheritdoc
     */
    setBody(body: object): void;

    /**
     * @inheritdoc
     */
    getData(): PlayerList[];
}

declare class ServersResponse extends Response {
    servers: Server[];

    /**
     * @inheritdoc
     */
    setBody(body: object): void;

    /**
     * @inheritdoc
     */
    getData(): Server[];
}

interface ServerStatus {
    OFFLINE: 0;
    ONLINE: 1;
    STARTING: 2;
    STOPPING: 3;
    RESTARTING: 4;
    SAVING: 5;
    LOADING: 6;
    CRASHED: 7;
    PENDING: 8;
    PREPARING: 10;
}

type PlayerListTypes = 'whitelist' | 'blacklist';

declare class PlayerList {
    /**
     * List name / identifier
     */
    name: string;

    private server: Server;
    private client: Client;

    /**
     * @param name
     */
    constructor(name: string);

    /**
     * Set the server for this list
     *
     * @param server
     */
    setServer(server: Server): PlayerList;

    /**
     * Set the API client
     *
     * @param client
     */
    setClient(client: Client): PlayerList;

    /**
     * Get the list name
     */
    getName(): string;

    getEntries(): Promise<string[]>;

    /**
     * Add multiple entries
     *
     * @param entries
     */
    addEntries(entries: string[]): Promise<Response>;

    /**
     * Add a single entry
     *
     * @param entry
     */
    addEntry(entry: string): Promise<Response>;

    /**
     * Delete multiple entries
     *
     * @param entries
     */
    deleteEntries(entries: string[]): Promise<Response>;

    /**
     * Delete a single entry
     *
     * @param entry
     */
    deleteEntry(entry: string): Promise<Response>;
}

declare class Players {
    /**
     * Max amount of players / slots
     */
    max: number;

    /**
     * Current amount of players
     */
    count: number;

    /**
     * List of player names
     */
    list: string[];

    /**
     * Players constructor
     *
     * @param playersObject
     */
    constructor(playersObject: Players);
}

type Message = 'started' | 'stopped';

type StreamStatus = 1 | 2 | 3 | 4;

/**
 * @classdesc Websocket client to connect to the websocket for this server
 */
declare class WebsocketClient extends EventEmitter {
    protocol: 'wss' | string;
    private client: Client;
    private server: Server;
    private websocket: WebSocket;

    /**
     * Automatically reconnect in cas of a disconnect
     */
    autoReconnect: boolean;

    /**
     * Time to wait to reconnect
     *
     * Only change this with caution. A time too low here can
     * cause a spam in requests which can get your application
     * rate limited or even blocked.
     */
    reconnectTimeout: 3000 | number;

    private reconnectInterval;

    private connected: false | boolean;
    private shouldConnect: false | boolean;
    private serverConnected: false | boolean;
    private ready: false | boolean;
    private streams: Stream[];
    private availableStreams: {
        console: ConsoleStream;
        heap: HeapStream;
        stats: StatsStream;
        tick: TickStream;
    };

    /**
     * @param server
     */
    constructor(server: Server);

    /**
     * Connect to websocket
     */
    connect(): void;

    /**
     * Disconnect from the websocket and all streams
     */
    disconnect(): void;

    onOpen(): void;

    onClose(): void;

    onError(error: Error): boolean;

    onMessage(rawMessage: string): void;

    isConnected(): boolean;

    isReady(): boolean;

    getServer(): Server;

    getServerStatus(): Promise<ServerStatus>;

    /**
     * Get a stream by name
     *
     * @param stream
     */
    getStreams(stream: string): boolean | Stream;

    hasStream(stream: string): boolean;

    tryToStartStreams(): void;

    removeStreams(stream: string): void;

    /**
     * @param stream
     * @param type
     * @param data
     */
    send(stream: string, type: any, data: any): boolean;
}

declare class Stream extends EventEmitter {
    private client: WebsocketClient;
    private started: false | boolean;
    private shouldStart: false | boolean;
    name: string;
    startData: object;
    startStatuses: StreamStatus[];

    /**
     * @param client
     */
    constructor(client: WebsocketClient);

    send(type: any, data: any): boolean;

    /**
     * Status change event
     */
    onStatusChange(): boolean;

    /**
     * Message event listener
     *
     * @param message
     */
    onMessage(message: Message): void;

    onDataMessage(type: string, message: any): void;

    onDisconnect(): void;

    /**
     * Double event emitter for generic or specific event handling
     *
     * @param type
     * @param data
     */
    emitEvent(type: string, data: any[]): void;

    /**
     * Start this stream
     */
    start(data: any): void;

    /**
     * Should/can this stream be started
     */
    shouldBeStarted(): Promise<boolean>;

    /**
     * Try to start if possible
     */
    tryToStart(): Promise<void>;

    /**
     * Stop this stream
     */
    stop(): void;

    /**
     * Try to stop this stream if possible
     */
    tryToStop(): Promise<boolean>;

    isStarted(): boolean;
}

type subscriptionTypes = 'tick' | 'heap' | 'stats' | 'console';

declare class TickStream extends Stream {
    name: string;
    startStatuses: [1];
    onDataMessage(type: string, message: any): void;
}

declare class StatsStream extends Stream {
    name: string;
    startStatuses: [1];
}

declare class HeapStream extends Stream {
    name: string;
    startStatuses: [1];
}

declare class ConsoleStream extends Stream {
    private ansiRegex: RegExpConstructor;
    name: string;
    startData: { tail: 0 };

    onDataMessage(type: string, message: any): void;

    parseReturns(string: string): string;

    parseLine(line: string): string;

    sendCommand(command: string): void;
}
