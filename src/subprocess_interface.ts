'use strict';


class SubProcessClass {
    //Registry name
    registry_name: string 
    //Instance ID assigned at the time of init
    instance_id: number

    //Initalization function (Should be called from constructor)
    init: () => Promise<any>;

    //Registry registration method (Sends message)
    register: () => Promise<any>;

    //MessageRouter
    onMessageRouter: () => Promise<any>;
    
}

//because you cant do private shit in interface right now
export default interface SubProcess extends SubProcessClass {}
