import { Request, Response } from "express";
import userSchema from "../schema/userSchema";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";
import { createHash } from "crypto";
import * as utils from "../utils";
import UserModel from "../models/UserModel";

import Joi from "joi";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Password is required.',
    }),
});

export async function loginUser(req: Request, res: Response) {
  const { error: validationError, value: postData } = schema.validate(req.body, { abortEarly: false });

  if (validationError) {
    const validationErrors = validationError.details.map((detail) => ({
      field: detail.context?.key,
      message: detail.message,
    }));

    return res.status(400).json(
      new ErrorResponseBuilder()
        .withCode(400)
        .withMessage('Validation error. Please check your input.')
        .withStatus(ErrorStatus.badInput)
        .withDetails(validationErrors)
        .build()
    );
  }

  const foundUser = await UserModel.findUserBy('email', postData.email);

  if (!foundUser) {
    return res.status(404).json(
      new ErrorResponseBuilder()
        .withCode(404)
        .withMessage('Unable to find a user with that email, try registering for an account.')
        .withStatus(ErrorStatus.notFound)
        .withDetails({})
        .build()
    );
  }

  const hashedPasswordFromRequest = createHash('md5').update(postData.password).digest('hex');

  if (hashedPasswordFromRequest !== foundUser.password) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage('Invalid password for the user')
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  let token;
  try {
    token = utils.generateToken({ id: foundUser.id });
  } catch (error: any) {
    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage('Something went wrong while attempting to generate JWT token')
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }

  return res.status(200).json(
    new SuccessResponseBuilder()
      .withMessage('Successfully logged in for the user')
      .withData({
        user: {
          email: foundUser.email,
          token: token,
        },
      })
      .build()
  );
}


export async function registerUser(req: Request, res: Response) {
  const { error: schemaError, value: postData } = userSchema.validate(req.body, { abortEarly: true });

  if (schemaError) {
    return res.status(400).json(new ErrorResponseBuilder()
      .withCode(400)
      .withMessage(schemaError.details[0].message)
      .withStatus(ErrorStatus.badInput)
      .withDetails(schemaError.details.map(detail => ({ field: detail.context?.key, message: detail.message })))
      .build()
    );
  }

  try {
    const existingUser = await UserModel.findUserBy("email", postData.email);
    
    if (existingUser) {
      return res.status(409).json(new ErrorResponseBuilder()
        .withCode(409)
        .withMessage("User with the same email already exists")
        .withStatus(ErrorStatus.conflict)
        .withDetails({})
        .build()
      );
    }

    const hashedPassword = createHash("md5").update(postData.password).digest("hex");
    const newUser = await UserModel.createUser({
      email: postData.email,
      password: hashedPassword,
    });

    const token = utils.generateToken({ id: newUser.id });

    return res.status(201).json(new SuccessResponseBuilder()
      .withMessage("Successfully registered and logged in for the user")
      .withData({
        user: {
          email: newUser.email,
          token: token,
        }
      })
      .build()
    );
  } catch (error: any) {
    return res.status(500).json(new ErrorResponseBuilder()
      .withCode(500)
      .withMessage("Something went wrong while attempting to register and generate JWT token")
      .withStatus(ErrorStatus.internalError)
      .withDetails({
        error: error.message,
      })
      .build()
    );
  }
}

export async function deleteUser(req: Request, res: Response) {
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

  let token;
  try {
    token = utils.parseToken(parsedToken);
  } catch (error) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("Invalid token. Your JWT token is invalid or has expired. Please obtain a new token.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({})
        .build()
    );
  }

  let userId = token.id;

  try {
    const deletedUserId = await UserModel.deleteUserBy("id", userId);

    if (deletedUserId) {
      return res.status(200).json(
        new SuccessResponseBuilder()
          .withMessage("User deleted successfully.")
          .withData({ deletedUserId })
          .build()
      );
    } else {
      return res.status(404).json(
        new ErrorResponseBuilder()
          .withCode(404)
          .withMessage("User not found. The user associated with this token does not exist.")
          .withStatus(ErrorStatus.notFound)
          .withDetails({})
          .build()
      );
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);

    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Internal server error. An error occurred while deleting the user.")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: error.message,
        })
        .build()
    );
  }
}
