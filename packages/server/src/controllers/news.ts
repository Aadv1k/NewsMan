import { Request, Response } from "express";
import { ErrorResponseBuilder, SuccessResponseBuilder, ErrorStatus } from "../ResponseBuilder";

import * as utils from "../utils";

import provider from "@newsman/core"

export async function getHeadlines(req: Request, res: Response) {
    await provider.fetchHeadlines
}
