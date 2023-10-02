import { Request, Response } from "express";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";
import * as utils from "../utils";
import provider, { RegionCodeSet } from "@newsman/core";

import KeyModel from "../models/KeyModel";

export async function getHeadlines(req: Request, res: Response) {
  let { countryCode = "", excludeDomains = "", apiKey = "" } = req.query;

  if (!RegionCodeSet.has(countryCode)) {
    return res.status(400).json(
      new ErrorResponseBuilder()
        .withCode(400)
        .withMessage("Invalid country code.")
        .withStatus(ErrorStatus.badRequest)
        .withDetails({
          info: "Please provide a valid country code from the supported list.",
        })
        .build()
    );
  }

  try {
    excludeDomains = excludeDomains.map(e => (new URL(e)).origin)
  } catch (error: any) {
    return res.status(400).json(
      new ErrorResponseBuilder()
        .withCode(400)
        .withMessage("Invalid excludeDomains.")
        .withStatus(ErrorStatus.badRequest)
        .withDetails({
          info: "The provided excludeDomains are not valid URLs.",
        })
        .build()
    );
  }

  try {
    domains = domains.map(e => (new URL(e)).origin)
  } catch (error: any) {
    return res.status(400).json(
      new ErrorResponseBuilder()
        .withCode(400)
        .withMessage("Invalid domains.")
        .withStatus(ErrorStatus.badRequest)
        .withDetails({
          info: "The provided domains are not valid URLs.",
        })
        .build()
    );
  }

  if (!apiKey) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("API key is missing.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({
          info: "To access this resource, you need an API key. Please refer to our documentation on how to obtain an API key.",
        })
        .build()
    );
  }

  const foundKey = await KeyModel.findKeyBy("key", apiKey as string);

  if (!foundKey) {
    return res.status(401).json(
      new ErrorResponseBuilder()
        .withCode(401)
        .withMessage("API key not found.")
        .withStatus(ErrorStatus.unauthorized)
        .withDetails({
          info: "The provided API key is not valid. Please refer to our documentation on how to obtain a valid API key.",
        })
        .build()
    );
  }

  let headlines;

  try {
    headlines = await provider.fetchHeadlines({
      countryCode: countryCode as string,
      excludeDomains: excludeDomains as Array<string>,
    });

    return res.status(200).json(
      new SuccessResponseBuilder()
        .withMessage("Headlines fetched successfully.")
        .withData({ headlines })
        .build()
    );
  } catch (error) {
    console.error("Error fetching headlines:", error);

    return res.status(500).json(
      new ErrorResponseBuilder()
        .withCode(500)
        .withMessage("Internal server error. Error fetching headlines.")
        .withStatus(ErrorStatus.internalError)
        .withDetails({
          error: "An error occurred while fetching headlines. Please try again later.",
        })
        .build()
    );
  }
}
