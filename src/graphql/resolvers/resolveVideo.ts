import { AOCoreProcessRouter } from "../../router/AORouterInterface";
import { Http_Args } from '../../modules/http/http';
import { IAORouterMessage } from "../../router/AORouter";


export default function (aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return (obj: any, args: any, context: any, info: any) => {
        console.log(obj, args, context)
        
    }
}