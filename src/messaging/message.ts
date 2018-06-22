'use strict';

import Ajv from 'ajv';
import Debug from 'debug';
const debug = Debug('ao:core');
const error = Debug('ao:core:error');

/**
 * Message creation class with basic data validation
 */
export default class Message {
    
    constructor( message:Object ) {
        //Let's run a validator here.
        if( message ) {
            this.validate(message);
            //Head
            this.app_id = message.app_id:String;
            this.type_id = message.type_id:String;
            this.message_type = message.message_type:Object;
            this.signatures = message.signatures:Array; //Not sure what this data type is supposed to become?
            
            //Body
            this.data = message.data:Object
            this.encoding = message.encoding:String
        }
    }
    message_schema: {
        "required": {
            "app_id",
            "type_id",
            "data",
            "encoding"
        }
        "properties": {
            "app_id": {
                "type": "string",
            },
            "type_id": {
                "type": "string",
            },
            // "message_type": {},
            // "signatures": {},
            // "data": {},
            // "encoding": {}
        }
    }
    validate( message:Object ) {
        var ajv = new Ajv();
        var valid = ajv(this.message_schema, message);
        if(!valid) {
            //This means you're missing data on your message (its a super basic test)
            error(ajv.errors)
        }
        return;
    }

    //Head Getters/Setters
    get app_id() { return this.app_id; }
    set app_id(val) { this.app_id = val; }

    get type_id() { return this.type_id; }
    set type_id(val) { this.type_id = val; }

    get message_type() { return this.message_type; }
    set message_type(val) { this.message_type = val; }

    get signatures() { return this.signatures; }
    set signatures(val) { this.signatures = val; }

    //Message body
    get data() { return this.data; }
    set data(val) { this.data = val; }

    get encoding() { return this.encoding; }
    set encoding(val) { this.encoding = val; }


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