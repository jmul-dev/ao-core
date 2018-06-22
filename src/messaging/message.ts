'use strict';

import {validate} from 'jsonschema'
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');

/**
 * Message creation class with basic data validation
 */
export default class Message {
    constructor( initializer:Message ) {
        // return if no initializer is passed in 
        if (initializer === undefined) {
            return;
        }
        // apply 
        Object.keys(initializer).forEach((key, index) => {
            this[key] = initializer[key];
        });
    }
    message_schema:Object = {
        "id": "/MessageObject",
        "type": "object",
        "required": [
            "app_id",
            "type_id",
            "data",
            "encoding"
        ],
        "properties": {
            "app_id": {
                "type": "string"
            },
            "type_id": {
                "type": "string"
            },
            "message_type": {
                "type": "object"
            },
            "signatures": {
                "type": "object"
            },
            "data": {
                "type": "object"
            },
            "encoding": {
                "type": "string"
            }
        }
    }
    validate( message:Object ) {
        var result = validate( message, this.message_schema)
        if( result.valid ) {
            return true;
        } else {
            error('Message failed validation')
        }
        return;
    }

    //Head Getters/Setters
    get app_id() { return this.app_id; }
    set app_id(val:string) { this.app_id = val; }

    get type_id() { return this.type_id; }
    set type_id(val:string) { this.type_id = val; }

    get message_type() { return this.message_type; }
    set message_type(val:Object) { this.message_type = val; }

    get signatures() { return this.signatures; }
    set signatures(val:Object) { this.signatures = val; }

    //Message body
    get data() { return this.data; }
    set data(val:Object) { this.data = val; }

    get encoding() { return this.encoding; }
    set encoding(val:String) { this.encoding = val; }


    toJSON() {
        var message = {
            app_id: this.app_id,
            type_id: this.type_id,
            message_type: this.message_type,
            signatures: this.signatures,
            data: this.data,
            encoding: this.encoding
        };
        this.validate(message)
        return message
    }
}