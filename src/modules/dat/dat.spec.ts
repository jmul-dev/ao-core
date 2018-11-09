import AODat, { AODat_Args, DatEntry, DatStats } from './dat'
import path from 'path'
import fs from 'fs-extra'
import { expect } from 'chai'
import 'mocha';


describe('AO Dat module', () => {
    const datStorageLocation = path.resolve(__dirname, '../../../data')
    const remoteEncryptedDat = '95e3920c43df6b6e925611256ce72974c8e9eb5ea76f86fd5d578c775ceace74'
    const localEncryptedDat = 'fb4af663a5a0c4c30dc10a20e5be35e3a3e15286d97518922d9fdccfc804f03b'
    let aoDat;

    before(function(done) {        
        process.send = () => {}
        aoDat = new AODat({
            storageLocation: datStorageLocation,
            networkId: '4'
        })
        // Faking the router send method
        aoDat.router.send = (route, message) => {
            return new Promise((resolve, reject) => {
            })
        }
        done()           
    })

    // it('should resume all dats', (done) => {
    //     aoDat.router.emit('/dat/resumeSingle', {
    //         data: {
    //             key: localEncryptedDat
    //         },
    //         respond: () => {                
    //             done()
    //         },
    //         reject: done,
    //     })
    // })

    it('should resume all dats', (done) => {
        aoDat.router.emit('/dat/resumeAll', {
            data: {},
            respond: () => {
                done()
            },
            reject: done,
        })
    })

})



