import EthCrypto from "eth-crypto";
import Debug from "./AODebug";
const debug = Debug("ao:crypto");

export interface Identity {
    privateKey: string;
    publicKey: string;
    address: string;
}

/**
 * Generate local identity, public/private keys.
 */
export function createUserIdentity(): Identity {
    return EthCrypto.createIdentity();
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
export async function generateContentEncryptionKeyForUser({
    contentDecryptionKey,
    contentRequesterPublicKey,
    contentOwnersPrivateKey
}) {
    const encryptedKey = await EthCrypto.encryptWithPublicKey(
        contentRequesterPublicKey,
        contentDecryptionKey
    );
    const encryptedDecryptionKey = EthCrypto.cipher.stringify(encryptedKey);
    const encryptedDecryptionKeyHash = EthCrypto.hash.keccak256(
        encryptedDecryptionKey
    );
    const encryptedDecryptionKeySignature = EthCrypto.sign(
        contentOwnersPrivateKey,
        encryptedDecryptionKeyHash
    );
    return { encryptedDecryptionKey, encryptedDecryptionKeySignature };
}

/**
 * Hash of the baseChallenge. This is used in conjunction with generateBaseChallengeSignature()
 * to derive the content signature.
 *
 * @param {string} baseChallenge Also known as the file's checksum
 * @param {string} contractAddress The address of the AOContentHost contract (which verifies this hash)
 */
export function generateContentBaseChallengeHash({
    baseChallenge,
    contractAddress
}) {
    return EthCrypto.hash.keccak256([
        {
            type: "address",
            value: contractAddress
        },
        {
            type: "string",
            value: baseChallenge
        }
    ]);
}

/**
 * Signature of a baseChallenge string.
 *
 * @param {string} baseChallengeHash
 * @param {string} privateKey
 */
export function generateBaseChallengeSignature({
    baseChallengeHash,
    privateKey
}) {
    return EthCrypto.sign(privateKey, baseChallengeHash);
}

/**
 * Decrypt a message
 *
 * @param {string} message
 * @param {string} privateKey
 */
export function decryptMessage({ message, privateKey }): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const cipherObject = EthCrypto.cipher.parse(message);
            const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
                privateKey,
                cipherObject
            );
            resolve(decryptedMessage);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Encrypt a message
 *
 * @param {string} message
 * @param {string} publicKey Key of the recipient (only holder of corresponding private key can decrypt this message)
 */
export function encryptMessage({ message, publicKey }): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const encryptedCipher = EthCrypto.encryptWithPublicKey(
                publicKey,
                message
            );
            const encryptedMessage = EthCrypto.cipher.stringify(
                encryptedCipher
            );
            resolve(encryptedMessage);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Converts a signed string into vrs format
 *
 * @param {string} signature
 */
export function vrsFromSignature(signature: string) {
    return EthCrypto.vrs.fromString(signature);
}
