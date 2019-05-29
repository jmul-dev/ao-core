import { isAddress } from "web3-utils";
import ValidatorBase from "validator";
import AOContent from "./models/AOContent";

/**
 * Wrapping the validator library so we can add our own validation functions
 */
interface CustomValidations {
    isEthAddress: (input: string) => boolean;
    isValidContentType: (contentType: string) => boolean;
    isValidContentLicense: (contentType: string) => boolean;
}

// @ts-ignore
var AOValidator: ValidatorJS.ValidatorStatic &
    CustomValidations = ValidatorBase;
AOValidator.isEthAddress = function(str) {
    return isAddress(str);
};
AOValidator.isValidContentType = function(str) {
    for (const type in AOContent.Types) {
        if (AOContent.Types.hasOwnProperty(type)) {
            const element = AOContent.Types[type];
            if (str === element) return true;
        }
    }
    return false;
};
AOValidator.isValidContentLicense = function(str) {
    for (const type in AOContent.Licenses) {
        if (AOContent.Licenses.hasOwnProperty(type)) {
            const element = AOContent.Licenses[type];
            if (str === element) return true;
        }
    }
    return false;
};

export default AOValidator;
