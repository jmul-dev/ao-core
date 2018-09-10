import AOContent from "./AOContent";


export default interface AONetworkContent {
    _id: string;  /* metadataDatKey */
    content?: AOContent;
    status: 'imported' | 'failed';
}