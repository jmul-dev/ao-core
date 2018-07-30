import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import path from 'path';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('ao:dat');


export interface AODat_Args {

}

export interface AODat_Create_Data {
    
}


export default class AODat extends AORouterInterface {

    constructor(args: AODat_Args) {
        super()
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/remove', this._handleDatRemove.bind(this))
        this.router.on('/dat/list', this._handleDatList.bind(this))
        this.router.on('/dat/resumeAll', this._handleDatResumeAll.bind(this))
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        debug(`started`)
    }

    private _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data
        request.reject(new Error('Not implemented!'))
    }

    private _handleDatRemove(request: IAORouterRequest) {
        request.reject(new Error('Not implemented!'))
    }

    private _handleDatList(request: IAORouterRequest) {
        request.reject(new Error('Not implemented!'))
    }

    private _handleDatResumeAll(request: IAORouterRequest) {
        request.reject(new Error('Not implemented!'))
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        request.reject(new Error('Not implemented!'))
    }

}