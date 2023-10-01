import { Request, Response } from "express";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";

import * as utils from "../utils";

const parseAuthHeader = (auth: string): string | null => {
    const a = auth.split(" ");
    if (a.length !== 2) return null;
    if (a[0].toLowerCase() != "bearer") return null;
    return a.pop();

}

export async function createKey(req: Request, res: Response) {
  const parsedToken = parseAuthHeader(req.headers?.authorization ?? "");

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

  let token;
  try {
    token = utils.verifyToken(parsedToken);
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

  try {
    const createdKey = await KeyModel.createKey({
      user_id: token.id,
      key: "testkey123",
    });

    return res.status(201).json({
      message: "Key created successfully",
      apiKey: createdKey.key,
    });
  } catch (error) {
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


