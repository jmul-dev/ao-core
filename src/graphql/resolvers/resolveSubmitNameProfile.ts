import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";
import Debug from "../../AODebug";
const debug = Debug(`ao:resolveSubmitNameProfile`);

interface ISubmitTaoProfile_Args {
    inputs: {
        nameId: string;
        imageString: string;
    };
}

export default (
    obj: any,
    args: ISubmitTaoProfile_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        if (!args.inputs.imageString) {
            return reject(new Error(`Missing image string`));
        }
        debug(`profile image size: ${countUtf8(args.inputs.imageString)}`);
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "insertNameProfileImage",
            methodArgs: {
                nameId: args.inputs.nameId,
                imageString: args.inputs.imageString
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    nameId: args.inputs.nameId,
                    imageString: args.inputs.imageString
                });
            })
            .catch(reject);
    });
};

/**
 * Function to fix native charCodeAt()
 *
 * Now, we can use fixedCharCodeAt("foo€", 3); for multibyte (non-bmp) chars too.
 *
 * @access public
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/charCodeAt
 * @note If you hit a non-bmp surrogate, the function will return false
 * @param str String Mixed string to get charcodes
 * @param idx Integer Position of the char to get
 * @return code Integer Result charCodeAt();
 */
function fixedCharCodeAt(str, idx) {
    idx = idx || 0;
    var code = str.charCodeAt(idx);
    var hi, low;
    if (0xd800 <= code && code <= 0xdbff) {
        // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        hi = code;
        low = str.charCodeAt(idx + 1);
        if (isNaN(low)) {
            throw "Kein gültiges Schriftzeichen oder Speicherfehler!";
        }
        return (hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000;
    }
    if (0xdc00 <= code && code <= 0xdfff) {
        // Low surrogate
        // We return false to allow loops to skip this iteration since should have already handled high surrogate above in the previous iteration
        return false;
        /*hi = str.charCodeAt(idx-1);
         low = code;
         return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;*/
    }
    return code;
}
/**
 * Gets size of a UTF-8 string in bytes
 *
 * @autor Frank Neff <fneff89@gmail.com>
 * @license GPL v2
 * @access public
 * @param str String Input string to get bytesize
 * @return result String Size of the input string in bytes
 */
function countUtf8(str) {
    var result = 0;
    for (var n = 0; n < str.length; n++) {
        var charCode = fixedCharCodeAt(str, n);
        if (typeof charCode === "number") {
            if (charCode < 128) {
                result = result + 1;
            } else if (charCode < 2048) {
                result = result + 2;
            } else if (charCode < 65536) {
                result = result + 3;
            } else if (charCode < 2097152) {
                result = result + 4;
            } else if (charCode < 67108864) {
                result = result + 5;
            } else {
                result = result + 6;
            }
        }
    }
    return result;
}
