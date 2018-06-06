import sqlite3 from "sqlite3";
import Sequelize, { STRING, DATE, NOW } from "sequelize";
import assert from "assert";
import Debug from 'debug';
const debug = Debug('ao:db');

class Database {
    constructor() {
        this.memoryDB = new Sequelize('sqlite::memory:', {
            // logging: false
        })
        this.persistedDB = null
        // Model definitions
        this.Video = this.memoryDB.define('video', {
            title: STRING
        })
        this.Peer = this.memoryDB.define('peer', {
            id: {
                type: STRING,
                primaryKey: true,
            }
        })
        this.Log = this.memoryDB.define('log', {
            createdAt: { type: DATE, defaultValue: NOW },
            message: STRING
        })
    }
    init() {
        return this.memoryDB.sync({force: true})  // syncs all models (create tables)
    }
    close() {
        return this.memoryDB.close()
    }
}

export default Database;