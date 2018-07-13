'use strict';
const read_file_schema:Object = {
    "id": "/ReadFileObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}

const stream_read_file_schema:Object = {
    "id": "/StreamReadFileObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}

const write_file_schema:Object = {
    "id": "/WriteFileObject",
    "type": "object",
    "required": [
        "file_path",
        "file_data"
    ],
    "properties": {
        "file_path": {
            "type": "string",
            "containsNot":".."
        },
        "file_data": {
        },
        "encrypt": {
            "type": "boolean"
        }
    }
}

const stream_write_file_schema:Object = {
    "id": "/StreamWriteFileObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string",
            "containsNot":".."
        },
        "stream": {
            
        },
        "encrypt": {
            "type": "boolean"
        }
    }
}

const move_file_schema:Object = {
    "id": "/MoveFileObject",
    "type": "object",
    "required": [
        "src_path",
        "dest_path"
    ],
    "properties": {
        "src_path": {
            "type": "string",
            "containsNot":".."
        },
        "dest_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}

const delete_file_schema:Object = {
    "id": "/DeleteFileObject",
    "type": "object",
    "required": [
        "file_path"
    ],
    "properties": {
        "file_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}


const make_folder_schema:Object = {
    "id": "/MakeFolderObject",
    "type": "object",
    "required": [
        "folder_path"
    ],
    "properties": {
        "folder_path": {
            "type": "string",
            "containsNot":".."
        },
        "dat": {
            "type": "boolean"
        }
    }
}

const move_folder_schema:Object = {
    "id": "/MoveFolderObject",
    "type": "object",
    "required": [
        "src_path",
        "dest_path"
    ],
    "properties": {
        "src_path": {
            "type": "string",
            "containsNot":".."
        },
        "dest_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}

const delete_folder_schema:Object = {
    "id": "/DeleteFolderObject",
    "type": "object",
    "required": [
        "folder_path"
    ],
    "properties": {
        "folder_path": {
            "type": "string",
            "containsNot":".."
        }
    }
}


export {
    read_file_schema,
    stream_read_file_schema,
    write_file_schema,
    stream_write_file_schema,
    move_file_schema,
    delete_file_schema,
    make_folder_schema,
    move_folder_schema,
    delete_folder_schema,
}

