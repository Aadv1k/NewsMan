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
        .withMessage("Invalid or Missing `Authorization` header. Please provide a valid JWT token in the `Authorization` header.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  try {
    utils.verifyToken(parsedToken);
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error instanceof TokenExpiredError) {
      return res.status(401).json(
        new ErrorResponseBuilder()
          .withCode(401)
          .withMessage("Token has expired. Please obtain a new token.")
          .withStatus(ErrorStatus.unauthorized)
          .withDetails({})
          .build()
      );
    }

    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid token. Your JWT token is invalid. Please obtain a valid token.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  const token = utils.parseToken(parsedToken);

  const foundKey = await KeyModel.findKeyBy("user_id", token.id);

  if (foundKey) {
    return res.status(409).json(
      new ErrorResponseBuilder()
        .withCode(409)
        .withMessage("Key for the user already exists. You can retrieve the existing key using GET /key.")
        .withStatus(ErrorStatus.conflict)
        .withDetails({})
        .build()
    );
  }

  try {
    const createdKey = await KeyModel.createKey({
      user_id: token.id,
      key: utils.randomString(16),
    });

    return res.status(201).json(
      new SuccessResponseBuilder()
        .withMessage("Key created successfully.")
        .withData({
          api_key: createdKey.key,
          instructions: "Please keep this API key secure. It will be needed for authentication in future requests."
        })
        .build()
    );
  } catch (error: any) {
    console.error("Error creating key:", error);

    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Error creating key. An internal server error occurred while generating the API key.")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }
}

export async function deleteKey(req: Request, res: Response) {
  const parsedToken = utils.parseAuthHeader(req.headers?.authorization ?? "");

  if (!parsedToken) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid or Missing `Authorization` header. Please provide a valid JWT token in the `Authorization` header.")
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
        .withMessage("Invalid token. Your JWT token is invalid or has expired. Please obtain a new token.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  const token = utils.parseToken(parsedToken);

  try {
    const deletedKeyId = await KeyModel.deleteKeyBy("user_id", token.id);

    if (deletedKeyId) {
      return res.status(200).json(
        new SuccessResponseBuilder()
          .withMessage("Key deleted successfully.")
          .withData({ deletedKeyId })
          .build()
      );
    } else {
      return res.status(404).json(
        new ErrorResponseBuilder()
          .withCode(404)
          .withMessage("Key not found. The key associated with this token does not exist.")
          .withStatus(ErrorStatus.notFound)
          .withDetails({})
          .build()
      );
    }
  } catch (error: any) {
    console.error("Error deleting key:", error);
    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Internal server error. An error occurred while deleting the key.")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }
}

export async function getKey(req: Request, res: Response) {
  const parsedToken = utils.parseAuthHeader(req.headers?.authorization ?? "");

  if (!parsedToken) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid or Missing `Authorization` header. Please provide a valid JWT token in the `Authorization` header.")
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
        .withMessage("Invalid token. Your JWT token is invalid or has expired. Please obtain a new token.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  const token = utils.parseToken(parsedToken);

  try {
    const key = await KeyModel.findKeyBy("user_id", token.id);

    if (key) {
      return res.status(200).json(
      new SuccessResponseBuilder()
          .withMessage("Key found successfully.")
          .withData({ key })
          .build()
      );
    } else {
      return res.status(404).json(
        new ErrorResponseBuilder()
          .withCode(404)
          .withMessage("Key not found. The key associated with this token does not exist.")
          .withStatus(ErrorStatus.notFound)
          .withDetails({})
          .build()
      );
    }
  } catch (error: any) {
    console.error("Error finding key:", error);
    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Internal server error. An error occurred while finding the key.")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }
}
