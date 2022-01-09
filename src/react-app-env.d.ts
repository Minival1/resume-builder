/// <reference types="react-scripts" />
declare module "antd-mask-input"

import { StringSchema, MixedSchema } from "yup";

declare module "yup" {
    interface StringSchema {
        validatePhone(errorMessage: string): validatePhone;
    }
}
