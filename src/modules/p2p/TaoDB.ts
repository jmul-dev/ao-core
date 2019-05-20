import TAODBWrapper, { ITAODB_Entry } from "./TAODBWrapper";
import EthCrypto from "eth-crypto";
import AOContent from "../../models/AOContent";
import Debug from "../../AODebug";
const debug = Debug("ao:taodb");

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
export interface ITaoDB_ContentHost_Timestamp {
    timestamp: number;
    contentHostId: string;
    contentDatKey: string;
}

/**
 * Additional layer on top of AODB that adds schema helpers, schema
 * aware inserts, and user identity context.
 */
export default class TaoDB extends TAODBWrapper {
    public static ContentKey = "AO/Content";

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
        },
        contentHostTimestamp: {
            key: "schema/AO/Content/*/*/Hosts/%writerAddress%",
            value: {
                keySchema: "AO/Content/*/*/Hosts/%writerAddress%",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        nameProfileImage: {
            key: "schema/TAO/this/nameId/*/profileImage",
            value: {
                keySchema: "TAO/this/nameId/*/profileImage",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        taoDescription: {
            key: "schema/TAO/this/taoId/*/description/timestamp/%number%",
            value: {
                keySchema: "TAO/this/taoId/*/description/timestamp/%number%",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        taoThought: {
            key: "schema/TAO/this/taoId/*/thoughts/thoughtId/%number%",
            value: {
                keySchema: "TAO/this/taoId/*/thoughts/thoughtId/%number%",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        taoThoughtName: {
            key: "schema/TAO/this/taoId/*/thoughts/thoughtId/%number%/nameId/*",
            value: {
                keySchema:
                    "TAO/this/taoId/*/thoughts/thoughtId/%number%/nameId/*",
                valueValidationKey: "",
                keyValidation: ""
            }
        },
        taoNameThoughtPointer: {
            key: "schema/TAO/this/nameId/*/taoId/*/thoughts/thoughtId/%number%",
            value: {
                keySchema:
                    "TAO/this/nameId/*/taoId/*/thoughts/thoughtId/%number%",
                valueValidationKey: "",
                keyValidation: ""
            }
        }
    };

    public createSignedHash({ privateKey, key, value }) {
        return EthCrypto.sign(privateKey, this.createSignHash(key, value));
    }

    public async getWriterKeySignature({ nameId, nonce }) {
        if (!this._userIdentity)
            throw new Error(`User credentials have not been set`);
        if (!nameId || !nonce)
            throw new Error(
                `Writer key signature requires a nameId and a nonce`
            );
        const hashArgs = [
            {
                type: "address",
                value:
                    this.taodb.namePublicKey.address ||
                    this.taodb.namePublicKey._address
            },
            {
                type: "address",
                value: nameId
            },
            {
                type: "address",
                value: this._userIdentity.address
            },
            {
                type: "uint256",
                value: nonce
            }
        ];
        debug(hashArgs);
        const signHash = EthCrypto.hash.keccak256(hashArgs);
        return Promise.resolve(
            EthCrypto.sign(this._userIdentity.privateKey, signHash)
        );
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

    public async insertUserContentSignature({
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
        const schema: ITaoDB_Schema = this.schemas.userContent;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
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
        return `AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}/${contentDatKey}/indexData/signature`;
    }

    public async insertContentHostSignature({
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
        const schema: ITaoDB_Schema = this.schemas.contentHostSignature;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
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
        return `AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}/${contentDatKey}/indexData`;
    }

    public async insertContentHostIndexData({
        content,
        indexData
    }: {
        content: AOContent;
        indexData: ITaoDB_ContentHost_IndexData;
    }): Promise<any> {
        const key = TaoDB.getContentHostIndexDataKey({
            hostsPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey,
            contentDatKey: content.fileDatKey
        });
        const value = indexData;
        const schema: ITaoDB_Schema = this.schemas.contentHostIndexData;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
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
        return `AO/Content/${contentType}/${contentMetadataDatKey}/Hosts/${hostsPublicKey}`;
    }

    public async insertContentHostTimestamp({
        content
    }: {
        content: AOContent;
    }): Promise<any> {
        const key = TaoDB.getContentHostTimestampKey({
            hostsPublicKey: this._userIdentity.publicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        const value: ITaoDB_ContentHost_Timestamp = {
            timestamp: Date.now(),
            contentHostId: content.contentHostId,
            contentDatKey: content.fileDatKey
        };
        const schema: ITaoDB_Schema = this.schemas.contentHostTimestamp;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
        });
    }

    /**
     *
     * Content Hosts
     *
     */
    public static getContentHostsKey({ contentType, contentMetadataDatKey }) {
        return `AO/Content/${contentType}/${contentMetadataDatKey}/Hosts`;
    }
    public listContentHosts({
        content
    }: {
        content: AOContent;
    }): Promise<Array<ITAODB_Entry<any>>> {
        const key = TaoDB.getContentHostsKey({
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        return this.list(key, { recursive: false, reverse: true });
    }

    /**
     *
     * TAO Profile Image
     *
     */
    public static getNameProfileImageKey({ nameId }) {
        return `TAO/this/nameId/${nameId}/profileImage`;
    }
    public async insertNameProfileImage({
        nameId,
        imageString
    }: {
        nameId: string;
        imageString: string;
    }): Promise<any> {
        const key = TaoDB.getNameProfileImageKey({
            nameId
        });
        const value = imageString;
        const schema: ITaoDB_Schema = this.schemas.nameProfileImage;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
        });
    }

    /**
     *
     * TAO Description
     *
     */
    public static getTaoDescriptionKey({ taoId, timestamp }) {
        return `TAO/this/taoId/${taoId}/description/timestamp/${timestamp}`;
    }
    public static getTaoDescriptionListKey({ taoId }) {
        return `TAO/this/taoId/${taoId}/description`;
    }
    public async insertTaoDescription({
        taoId,
        description
    }: {
        taoId: string;
        description: string;
    }): Promise<any> {
        const key = TaoDB.getTaoDescriptionKey({
            taoId,
            timestamp: Math.round(new Date().getTime() / 1000)
        });
        const value = description;
        const schema: ITaoDB_Schema = this.schemas.taoDescription;
        const schemaExists = await this.exists(schema.key);
        if (!schemaExists) {
            throw new Error(`Schema does not exist`);
        }
        return this.insert({
            key,
            value,
            schemaKey: schema.key
        });
    }

    /**
     *
     * TAO Thought
     *
     */
    public static getTaoThoughtKey({ taoId, thoughtId }) {
        return `TAO/this/taoId/${taoId}/thoughts/thoughtId/${thoughtId}`;
    }
    public static getTaoThoughtNameKey({ taoId, thoughtId, nameId }) {
        return `TAO/this/taoId/${taoId}/thoughts/thoughtId/${thoughtId}/nameId/${nameId}`;
    }
    public static getTaoThoughtsListKey({ taoId }) {
        return `TAO/this/taoId/${taoId}/thoughts/thoughtId`;
    }
    public static getTaoNameThoughtKey({ taoId, nameId, thoughtId }) {
        return `TAO/this/nameId/${nameId}/taoId/${taoId}/thoughts/thoughtId/${thoughtId}`;
    }
    public async insertTaoThought({
        taoId,
        nameId,
        parentThoughtId,
        thought
    }: {
        taoId: string;
        nameId: string;
        parentThoughtId?: string;
        thought: string;
    }): Promise<any> {
        try {
            // 1. If parentThoughtId was passed, check that it exists
            if (parseInt(parentThoughtId) > 0) {
                const parentThoughtKey = TaoDB.getTaoThoughtKey({
                    taoId,
                    thoughtId: parentThoughtId
                });
                const parentThoughtExist = await this.count(parentThoughtKey);
                if (!parentThoughtExist) {
                    throw new Error(`Parent thought does not exist`);
                }
            }
            const thoughtListKey = TaoDB.getTaoThoughtsListKey({ taoId });
            const thoughtCount = await this.count(thoughtListKey);
            const thoughtId = thoughtCount + 1;

            const key = TaoDB.getTaoThoughtNameKey({
                taoId,
                thoughtId,
                nameId
            });
            const value = {
                nameId,
                parentThoughtId,
                thought,
                timestamp: Math.round(new Date().getTime() / 1000)
            };
            const schema: ITaoDB_Schema = this.schemas.taoThoughtName;
            const schemaExists = await this.exists(schema.key);
            if (!schemaExists) {
                throw new Error(`Schema does not exist`);
            }
            await this.insert({
                key,
                value,
                schemaKey: schema.key,
                options: {
                    pointerSchemaKey: this.schemas.taoNameThoughtPointer.key,
                    pointerKey: TaoDB.getTaoNameThoughtKey({
                        taoId,
                        nameId,
                        thoughtId
                    })
                }
            });
            return Promise.resolve(value);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
