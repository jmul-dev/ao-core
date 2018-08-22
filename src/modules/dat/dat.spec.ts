import AODat, { AODat_Args, DatEntry, DatStats } from './dat'
import path from 'path'
import fs from 'fs-extra'
import { expect } from 'chai'
import 'mocha';


describe('AO Dat module', () => {
    const datStorageLocation = path.resolve(__dirname, '../../../data/test')
    const knownDat = {
        key: '612573ac12f31ebe5491c7544ce4937054f9124770a17ffeab974d62f223239f',
        files: 1,
    }
    let aoEth;

    before(function(done) {        
        fs.ensureDir(datStorageLocation + '/content').then(() => {
            aoEth = new AODat({
                storageLocation: datStorageLocation
            })
            // Faking the router send method
            aoEth.router.send = (route, message) => {
                return new Promise((resolve, reject) => {
                })
            }      
            done()  
        }).catch(done)        
    })

    after(function(done) {
        fs.remove(datStorageLocation, function() {
            done()
        })        
    })

    it('should resume all dats', (done) => {
        aoEth.router.emit('/dat/resumeAll', {
            data: {},
            respond: done,
            reject: done,
        })
    })

    // 1. Initiate the download
    it('should initiate download of known dat', (done) => {        
        aoEth.router.emit('/dat/download', {
            data: {
                key: knownDat.key
            },
            respond: (datEntry: DatEntry) => {
                expect(datEntry.key).to.equal(knownDat.key)
                expect( fs.pathExistsSync( path.resolve(datStorageLocation, 'content', knownDat.key) ) ).to.be.true
                done()                
            },
            reject: done,
        })
    }).timeout(30000)  // allow time for dat to connect to network and initiate download ~30s

    // 2. Check that dat stats are available for the initiated dat above
    it('should get stats for known dat', (done) => {        
        aoEth.router.emit('/dat/stats', {
            data: {
                key: knownDat.key
            },
            respond: (datStats: DatStats) => {
                expect(datStats).to.have.keys(['files', 'length', 'byteLength', 'version', 'downloaded', 'network', 'peers'])
                done()
            },
            reject: done
        })
    })

    // 3. Listen for progress / completion
    it('should complete download of known dat', (done) => {
        let retries = 10
        function checkIfDatExists() {
            retries--;
            aoEth.router.emit('/dat/exists', {
                data: {
                    key: knownDat.key
                },
                respond: (datEntry: DatEntry) => {
                    expect(datEntry.complete).to.be.true
                    done()
                },
                reject: (err) => {
                    // does not exists or not complete
                    if ( retries <= 0 ) {
                        done(err)
                    } else {
                        setTimeout(checkIfDatExists, 1000)
                    }
                }
            })
        }
        checkIfDatExists()
    }).timeout(30000)

})



