import { Request, Response } from "express";
import userSchema from "../schema/userSchema";
import { ErrorResponseBuilder, ErrorStatus } from "../ResponseBuilder";

interface User {
    email: string;
    id?: string;
    password: string;
}

export function loginUser(req: Request, res: Response) {
    const { error: schemaError, value: postData} = userSchema.validate(req.body, { abortEarly: true });

    if (schemaError) {
        return res.status(400).json(new ErrorResponseBuilder()
            .withCode(400)
            .withMessage(schemaError.details[0].message)
            .withStatus(ErrorStatus.badInput)
            .withDetails(schemaError.details.map(detail => ({ field: detail.context?.key, message: detail.message })))
            .build()
        )
    }
}

export function registerUser(req: Request, res: Response) {
    const { error: schemaError, value: postData} = userSchema.validate(req.body, { abortEarly: true });

    if (schemaError) {
        return res.status(400).json(new ErrorResponseBuilder()
            .withCode(400)
            .withMessage(schemaError.details[0].message)
            .withStatus(ErrorStatus.badInput)
            .withDetails(schemaError.details.map(detail => ({ field: detail.context?.key, message: detail.message })))
            .build()
        )
    }
}