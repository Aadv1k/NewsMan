import { Request, Response } from "express";
import userSchema from "../schema/userSchema";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";
import { createHash } from "crypto";
import * as utils from "../utils";
import UserModel from "../models/UserModel";

export async function loginUser(req: Request, res: Response) {
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

  const foundUser = await UserModel.findUserBy("email", postData.email);

  if (!foundUser) {
    return res.status(404).json(new ErrorResponseBuilder()
      .withCode(404)
      .withMessage("Unable to find a user with that email, try registering for an account.")
      .withStatus(ErrorStatus.notFound)
      .withDetails({})
      .build()
    );
  }

  const hashedPassword = createHash("md5").update(foundUser.password).digest("hex");

  if (hashedPassword !== foundUser.password) {
    return res.status(401).json(new ErrorResponseBuilder()
      .withCode(401)
      .withMessage("Invalid password for the user")
      .withStatus(ErrorStatus.unauthorized)
      .withDetails({})
      .build()
    );
  }

  let token;
  try {
    token = utils.generateToken({ id: foundUser.id });
  } catch (error: any) {
    return res.status(500).json(new ErrorResponseBuilder()
      .withCode(500)
      .withMessage("Something went wrong while attempting to generate JWT token")
      .withStatus(ErrorStatus.internalError)
      .withDetails({
        error: error.message,
      })
      .build()
    );
  }

  return res.status(200).json(new SuccessResponseBuilder()
    .withMessage("Successfully logged in for the user")
    .withData({
      user: {
        email: foundUser.email,
        token: token,
      }
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
