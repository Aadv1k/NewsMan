import { Request, Response } from "express";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";

import KeyModel from "../models/KeyModel";

import * as utils from "../utils";

export async function createKey(req: Request, res: Response) {
  const parsedToken = utils.parseAuthHeader(req.headers?.authorization ?? "");

  if (!parsedToken) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid or Missing `Authorization` header")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  try {
    utils.verifyToken(parsedToken);
  } catch (error) {
    console.error("Error verifying token:", error);

    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid token")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }


  const token = utils.parseToken(parsedToken);

  try {
    const createdKey = await KeyModel.createKey({
      user_id: token.id,
      key: utils.randomString(16),
    });

    return res.status(201).json(new SuccessResponseBuilder().withMessage("Key created successfully").withData({
        api_key: createdKey.key
    }));

  } catch (error: any) {
    console.error("Error creating key:", error);

    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Error creating key")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }
}

export async function deleteKey(req: Request, res: Response) {

}

export async function cycleKey(req: Request, res: Response) {

}


