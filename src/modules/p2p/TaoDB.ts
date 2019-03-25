import AODB, { AODB_Entry } from "./AODB";
import EthCrypto from "eth-crypto";
import { Identity } from "../../AOCrypto";
import AOContent from "../../models/AOContent";

export interface ITaoDB_Schema {
    key: string;
    value: {
        keySchema: string;
        valueValidationKey?: string;
        keyValidation?: string;
    };
}

export interface ITaoDB_Schema_Insert extends ITaoDB_Schema {
    type: string;
    writerSignature: string;
    writerAddress: string;
}

export interface ITaoDB_ContentHost_IndexData {
    [key: string]: ITaoDB_ContentHost_IndexData_Entry;
}
export interface ITaoDB_ContentHost_IndexData_Entry {
    decryptionKey: string;
    signature: string;
}

/**
 * Additional layer on top of AODB that adds schema helpers, schema
 * aware inserts, and user identity context.
 */
export default class TaoDB extends AODB {
    private _userIdentity: Identity;
    private schemasHaveBeenRegistered: boolean = false; // schema registration only needs to occur once
    public schemas: { [key: string]: ITaoDB_Schema } = {
        userContent: {
            key: "schema/%writerAddress%/AO/Content/*/*/signature",
            value: {
                keySchema: "%writerAddress%/AO/Content/*/*/signature",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        contentHostSignature: {
            key:
                "schema/AO/Content/*/*/Hosts/%writerAddress%/*/indexData/signature",
            value: {
                keySchema:
                    "AO/Content/*/*/Hosts/%writerAddress%/*/indexData/signature",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        contentHostIndexData: {
            key: "schema/AO/Content/*/*/Hosts/%writerAddress%/*/indexData",
            value: {
                keySchema: "AO/Content/*/*/Hosts/%writerAddress%/*/indexData",
                valueValidationKey: "",
                keyValidation: ""
            }
        }
    };

    public setUserIdentity(v: Identity): Promise<any> {
        this._userIdentity = v;
        return this.registerSchemas(v);
    }

    /**
     * Register the aodb schemas. Requires user to get and sign each schema
     * before this point.
     *
     * @param signedSchemas
     */
    public registerSchemas(signerIdentity: Identity): Promise<any> {
        if (this.schemasHaveBeenRegistered) return Promise.resolve();
        let signedSchemas: Array<ITaoDB_Schema_Insert> = Object.keys(
            this.schemas
        ).map(key => {
            const schema = this.schemas[key];
            return {
                key: schema.key,
                value: schema.value,
                type: "add-schema",
                writerAddress: signerIdentity.publicKey,
                writerSignature: this.createSignedHash({
                    privateKey: signerIdentity.privateKey,
                    key: schema.key,
                    value: schema.value
                })
            };
        });
        return this.batchInsert(signedSchemas).then(() => {
            this.schemasHaveBeenRegistered = true;
            return Promise.resolve();
        });
    }

    public createSignedHash({ privateKey, key, value }) {
        return EthCrypto.sign(privateKey, this.createSignHash(key, value));
    }

    /**
     *
     * User Content Schema
     *
     */
    public static getUserContentSignatureKey({
        usersPublicKey,
        contentType,
        contentMetadataDatKey
    }) {
        return `${usersPublicKey}/AO/Content/${contentType}/${contentMetadataDatKey}/signature`;
    }

    public insertUserContentSignature({
        content
    }: {
        content: AOContent;
    }): Promise<any> {
        const key = TaoDB.getUserContentSignatureKey({
            usersPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        const value = content.baseChallengeSignature;
        const writerSignature = this.createSignedHash({
            privateKey: this._userIdentity.privateKey,
            key,
            value
        });
        return this.insert({
            key,
            value,
            writerAddress: this._userIdentity.publicKey,
            writerSignature,
            schemaKey: this.schemas.userContent.key
        });
    }

    /**
     *
     * Content Host Signature
     *
     */
    public static getContentHostSignatureKey({
        hostsPublicKey,
        contentType,
        contentMetadataDatKey,
        contentDatKey
    }) {
        return `/AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}/${contentDatKey}/indexData/signature`;
    }

    public insertContentHostSignature({
        content
    }: {
        content: AOContent;
    }): Promise<any> {
        const key = TaoDB.getContentHostSignatureKey({
            hostsPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey,
            contentDatKey: content.fileDatKey
        });
        const value = content.baseChallengeSignature;
        const writerSignature = this.createSignedHash({
            privateKey: this._userIdentity.privateKey,
            key,
            value
        });
        return this.insert({
            key,
            value,
            writerAddress: this._userIdentity.publicKey,
            writerSignature,
            schemaKey: this.schemas.userContent.key
        });
    }

    /**
     *
     * Content Host indexData (decryption key handoff)
     *
     */
    public static getContentHostIndexDataKey({
        hostsPublicKey,
        contentType,
        contentMetadataDatKey,
        contentDatKey
    }) {
        return `/AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}/${contentDatKey}/indexData`;
    }

    public insertContentHostIndexData({
        content,
        indexData
    }: {
        content: AOContent;
        indexData: ITaoDB_ContentHost_IndexData;
    }): Promise<any> {
        const key = TaoDB.getContentHostSignatureKey({
            hostsPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey,
            contentDatKey: content.fileDatKey
        });
        const value = indexData;
        const writerSignature = this.createSignedHash({
            privateKey: this._userIdentity.privateKey,
            key,
            value
        });
        return this.insert({
            key,
            value,
            writerAddress: this._userIdentity.publicKey,
            writerSignature,
            schemaKey: this.schemas.userContent.key
        });
    }

    /**
     *
     * Content Host Timestamp (last seen/online host)
     *
     */
    public static getContentHostTimestampKey({
        hostsPublicKey,
        contentType,
        contentMetadataDatKey
    }) {
        return `/AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}`;
    }

    public insertContentHostTimestamp({
        content
    }: {
        content: AOContent;
    }): Promise<any> {
        const key = TaoDB.getContentHostTimestampKey({
            hostsPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        const value = {
            timestamp: Date.now(),
            contentHostId: content.contentHostId,
            contentDatKey: content.fileDatKey
        };
        const writerSignature = this.createSignedHash({
            privateKey: this._userIdentity.privateKey,
            key,
            value
        });
        return this.insert({
            key,
            value,
            writerAddress: this._userIdentity.publicKey,
            writerSignature,
            schemaKey: this.schemas.userContent.key
        });
    }

    /**
     *
     * Content Hosts
     *
     */
    public static getContentHostsKey({ contentType, contentMetadataDatKey }) {
        return `/AO/Content/${contentType}/${contentMetadataDatKey}/Hosts`;
    }
    public listContentHosts({
        content
    }: {
        content: AOContent;
    }): Promise<Array<AODB_Entry<any>>> {
        const key = TaoDB.getContentHostsKey({
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        return this.list(key, { recursive: false });
    }
}
