'use strict';
import {message_schema} from './validation_schemas'
import {validate} from 'jsonschema'
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');

/**
 * Message creation class with basic data validation
 */
export default class Message {
    constructor( initializer:Object ) {
        // return if no initializer is passed in 
        if (initializer === undefined) {
            return;
        }
        // apply 
        Object.keys(initializer).forEach((key, index) => {
            this[key] = initializer[key];
        });
    }
    private message_schema:Object = message_schema

    validate( message:Object ) {
        var result = validate( message, this.message_schema)
        if( result.valid ) {
            return;
        }
        error('Message failed validation');
    }


    //Head Getters/Setters
    private _app_id:string;
    get app_id() { return this._app_id; }
    set app_id(val:string) { this._app_id = val; }

    private _type_id:string;
    get type_id() { return this._type_id; }
    set type_id(val:string) { this._type_id = val; }

    private _instance_id:string;
    get instance_id() { return this._instance_id; }
    set instance_id(val:string) { this._instance_id = val; }

    private _event:string;
    get event() { return this._event }
    set event(val:string) { this._event = val; }

    private _from:string;
    get from() { return this._from }
    set from(val:string) { this._from = val; }

    private _message_type:Object;
    get message_type() { return this._message_type; }
    set message_type(val:Object) { this._message_type = val; }

    private _signatures:Object;
    get signatures() { return this._signatures; }
    set signatures(val:Object) { this._signatures = val; }

    //Message body
    private _data:any
    get data() { return this._data; }
    set data(val:any ) { this._data = val; }

    private _encoding:string
    get encoding() { return this._encoding; }
    set encoding(val:string) { this._encoding = val; }


    toJSON() {
        var message = {
            app_id: this._app_id,
            type_id: this._type_id,
            instance_id: this._instance_id,
            event: this._event,
            from: this._from,
            message_type: this._message_type,
            signatures: this._signatures,
            data: this._data,
            encoding: this._encoding
        };
        this.validate(message)//incase someone used getters and setters instead.
        return message
    }
}

