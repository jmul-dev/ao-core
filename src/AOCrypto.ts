import EthCrypto from 'eth-crypto';
const AOContentContract = require('ao-contracts/build/contracts/AOContent.json');

export interface Identity {
    privateKey: string;
    publicKey: string;
    address: string;
}

/**
 * Generate local identity, public/private keys.
 */
export function createUserIdentity(): Identity {
    return EthCrypto.createIdentity()
}

/**
 * This method generates an encrypted decryption key for a given piece of content. By encrypting
 * with the requester's publicKey, we guarentee that only the requester can decrypt this key with
 * their corresponding privateKey.
 * 
 * @param {string} contentDecryptionKey
 * @param {string} contentRequesterPublicKey
 * @param {string} contentOwnersPrivateKey
 */
export async function generateContentEncryptionKeyForUser({contentDecryptionKey, contentRequesterPublicKey, contentOwnersPrivateKey}) {
    const encryptedKey = await EthCrypto.encryptWithPublicKey(contentRequesterPublicKey, contentDecryptionKey)
    const encryptedDecryptionKey = EthCrypto.cipher.stringify(encryptedKey)
    const encryptedDecryptionKeyHash = EthCrypto.hash.keccak256(encryptedDecryptionKey)
    const encryptedDecryptionKeySignature = EthCrypto.sign(contentOwnersPrivateKey, encryptedDecryptionKeyHash)
    return { encryptedDecryptionKey, encryptedDecryptionKeySignature }
}

/**
 * baseChallenge (public key) of the content is simply the hash of the original files checksum.
 * 
 * @param {string} fileChecksum
 * @param {string} contractAddress The address of the AOContent contract (which verifies this hash)
 */
export function generateContentBaseChallenge({fileChecksum, contractAddress}) {
    return EthCrypto.hash.keccak256([
        {
            type: "address",
            value: contractAddress
        },
        {
            type: "string",
            value: fileChecksum
        }
    ])
}

/**
 * Signature of a baseChallenge string.
 * 
 * @param {string} baseChallenge
 * @param {string} privateKey
 */
export function generateBaseChallengeSignature({baseChallenge, privateKey}) {
    return EthCrypto.sign(privateKey, baseChallenge)
}

/**
 * Decrypt a message
 * 
 * @param {string} message
 * @param {string} privateKey
 */
export function decryptMessage({message, privateKey}): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const cipherObject = EthCrypto.cipher.parse(message)
            const decryptedMessage = await EthCrypto.decryptWithPrivateKey(privateKey, cipherObject)
            resolve(decryptedMessage)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Encrypt a message
 * 
 * @param {string} message
 * @param {string} publicKey Key of the recipient (only holder of corresponding private key can decrypt this message)
 */
export function encryptMessage({message, publicKey}): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const encryptedCipher = EthCrypto.encryptWithPublicKey(publicKey, message)
            const encryptedMessage = EthCrypto.cipher.stringify(encryptedCipher)
            resolve(encryptedMessage)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Converts a signed string into vrs format
 * 
 * @param {string} signature
 */
export function vrsFromSignature(signature: string) {
    return EthCrypto.vrs.fromString( signature )
}