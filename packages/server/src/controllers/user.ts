import { Request, Response } from "express";
import userSchema from "../schema/userSchema";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";

import { JWT_SECRET } from "../config"

import jwt from "jsonwebtoken"

import { createHash } from "node:crypto";

export interface User {
    email: string;
    id?: string;
    password: string;
}

export async function loginUser(req: Request, res: Response) {
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


    const foundUser = await UserModel.findUserBy("email", postData.email);

    if (!foundUser) {
        return res.status(404).json(new ErrorResponseBuilder()
            .withCode(404)
            .withMessage("Unable to find an user with that email, try registering for an account.")
            .withStatus(ErrorStatus.notFound)
            .withDetails({})
            .build();
    }


    const hashedPassword = createHash("md5").update(foundUser.password).digest("hex");

    if (hashedPassword != foundUser.password) {
        return res.status(401).json(new ErrorResponseBuilder()
            .withCode(401)
            .withMessage("Invalid password for the user")
            .withStatus(ErrorStatus.unauthorized)
            .withDetails({})
            .build());
    }


    const token = jwt.sign({
        id: foundUser.id
    }, JWT_SECRET);


   return res.status(200).json(new SuccessResponseBuilder()
       .withMessage("Successfully login for the user")
       .withData({
           user: {
               email: foundUser.email,
               token: token
           }
       })
       .build());
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
