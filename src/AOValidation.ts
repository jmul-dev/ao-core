import { isAddress } from "web3-utils";
import ValidatorBase from "validator";
import AOContent from "./models/AOContent";

/**
 * Wrapping the validator library so we can add our own validation functions
 */
// @ts-ignore
const AOValidator: ValidatorJS.ValidatorStatic & CustomValidations = () => {};
// function AOValidator() {}
for (const key in ValidatorBase) {
    if (ValidatorBase.hasOwnProperty(key)) {
        const validationFunction = ValidatorBase[key];
        AOValidator.prototype[key] = validationFunction;
        // async function(errorMessage: string, ...args: any[]): Promise<any> {
        //     if (!validationFunction(...args))
        //         throw new Error(errorMessage)
        // }
    }
}
interface CustomValidations {
    prototype: any;
    isEthAddress: (input: string) => boolean;
    isValidContentType: (contentType: string) => boolean;
    isValidContentLicense: (contentType: string) => boolean;
}
AOValidator.prototype.isEthAddress = function(str) {
    return isAddress(str);
};
AOValidator.prototype.isValidContentType = function(str) {
    for (const type in AOContent.Types) {
        if (AOContent.Types.hasOwnProperty(type)) {
            const element = AOContent.Types[type];
            if (str === element) return true;
        }
    }
    return false;
};
AOValidator.prototype.isValidContentLicense = function(str) {
    for (const type in AOContent.Licenses) {
        if (AOContent.Licenses.hasOwnProperty(type)) {
            const element = AOContent.Licenses[type];
            if (str === element) return true;
        }
    }
    return false;
};

export default AOValidator;
