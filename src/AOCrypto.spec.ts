import { expect } from "chai";
import "mocha";
import * as AOCrypto from "./AOCrypto";
import EthCrypto from "eth-crypto";

describe("AOCrypto", () => {
    const identityA = AOCrypto.createUserIdentity();
    const identityB = AOCrypto.createUserIdentity();
    const fakeContentDecryptionKey = "0xDEADBEEF";

    it("A should generate content encryption key for user B", async () => {
        // User A encrypts the decryption key with user B's publicKey
        const {
            encryptedDecryptionKey,
            encryptedDecryptionKeySignature
        } = await AOCrypto.generateContentEncryptionKeyForUser({
            contentDecryptionKey: fakeContentDecryptionKey,
            contentOwnersPrivateKey: identityA.privateKey,
            contentRequesterPublicKey: identityB.publicKey
        });
        console.log(`edk: ${encryptedDecryptionKey}`);
        expect(encryptedDecryptionKey).to.exist;
        expect(encryptedDecryptionKeySignature).to.exist;
        // User B decrypts the encrypted key with their private key
        const decryptedKey = await AOCrypto.decryptMessage({
            message: encryptedDecryptionKey,
            privateKey: identityB.privateKey
        });
        expect(decryptedKey).to.equal(fakeContentDecryptionKey);
    });

    it("should recover public key from content encryption signature", async () => {
        const {
            encryptedDecryptionKey,
            encryptedDecryptionKeySignature
        } = await AOCrypto.generateContentEncryptionKeyForUser({
            contentDecryptionKey: fakeContentDecryptionKey,
            contentOwnersPrivateKey: identityA.privateKey,
            contentRequesterPublicKey: identityB.publicKey
        });
        console.log(`edk: ${encryptedDecryptionKey}`);

        const signer = EthCrypto.recoverPublicKey(
            encryptedDecryptionKeySignature,
            EthCrypto.hash.keccak256(encryptedDecryptionKey)
        );
        expect(signer).to.equal(identityA.publicKey);
    });
});
