'use strict';


const dat_set_eth_address_schema:Object = {
    "id": "/DatSetEthAddressObject",
    "type": "object",
    "required": [
        "eth_address"
    ],
    "properties": {
        "eth_address": {
            "type": "string"
        }
    }
}

const dat_resume_all_schema:Object = {
    "id": "/DatResumeAllObject",
    "type": "object",
    "required": [
        "eth_address"
    ],
    "properties": {
        "eth_address": {
            "type": "string"
        }
    }
}

const dat_add_schema:Object = {
    "id": "/DatAddObject",
    "type": "object",
    "required": [
        "file_path",
        "file_json"
    ],
    "properties": {
        "file_path": {
            "type": "string"
        },
        "file_json": {
            
        }
    }
}

const dat_file_uploaded_schema:Object = {
    "id": "/DatFileUploadedObject",
    "type": "object",
    "required": [
    ],
    "properties": {
    }
}

const dat_pause_schema:Object = {
    "id": "/DatPauseObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string"
        }
    }
}

const dat_stop_schema:Object = {
    "id": "/DatStopObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string"
        }
    }
}

export {
    dat_set_eth_address_schema,
    dat_resume_all_schema,
    dat_add_schema,
    dat_file_uploaded_schema,
    dat_pause_schema,
    dat_stop_schema
}

