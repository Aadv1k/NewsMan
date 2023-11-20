import { Request, Response } from "express";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";
import * as utils from "../utils";

import * as NewsMan from "@newsman/core";

import newsCache from "../newsCache";

import KeyModel from "../models/KeyModel";

export async function getHeadlines(req: Request, res: Response) {
  let { countryCode = "", excludeDomains = "", apiKey = "" } = req.query;

  // Default values for countryCode and excludeDomains
  countryCode = countryCode || "";
  excludeDomains = excludeDomains ? (excludeDomains as string).split(",").map((e: string) => new URL(e).origin) : [];

  if (countryCode !== "" && !/^[a-zA-Z]{2}$/.test(countryCode as string)) {
    return res.status(400).json({
      code: 400,
      message: "Invalid country code.",
      status: "badRequest",
      details: {
        info: "Please provide a valid two-letter country code.",
      },
    });
  }

  if (excludeDomains.length > 0) {
    try {
      excludeDomains = excludeDomains.map((e: string) => new URL(e).origin);
    } catch (error: any) {
      return res.status(400).json({
        code: 400,
        message: "Invalid excludeDomains.",
        status: "badInput",
        details: {
          info: "The provided excludeDomains are not valid URLs.",
        },
      });
    }
  }

  if (!apiKey) {
    return res.status(401).json({
      code: 401,
      message: "API key is missing.",
      status: "unauthorized",
      details: {
        info: "To access this resource, you need an API key. Please refer to our documentation on how to obtain an API key.",
      },
    });
  }

  // Assuming KeyModel.findKeyBy returns a promise
  const foundKey = await KeyModel.findKeyBy("key", apiKey as string);

  if (!foundKey) {
    return res.status(401).json({
      code: 401,
      message: "API key not found.",
      status: "unauthorized",
      details: {
        info: "The provided API key is not valid. Please refer to our documentation on how to obtain a valid API key.",
      },
    });
  }

  let headlines;

  try {
    headlines = await NewsMan.fetchHeadlines({
      countryCode: countryCode as string,
      excludeDomains: excludeDomains as Array<string>,
    }, newsCache);

    return res.status(200).json({
      message: "Headlines fetched successfully.",
      data: { headlines },
    });
  } catch (error) {
    console.error("Error fetching headlines:", error);

    return res.status(500).json({
      code: 500,
      message: "Internal server error. Error fetching headlines.",
      status: "internalError",
      details: {
        error: "An error occurred while fetching headlines. Please try again later.",
      },
    });
  }
}
