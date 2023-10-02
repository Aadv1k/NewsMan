import express from "express";
import { ErrorStatus, ErrorResponseBuilder } from "../../ResponseBuilder";
import { getHeadlines } from "../../controllers/news";

const router: express.Router = express.Router();

// router.get("/everything", getEverything);
router.get("/headlines ", getHeadlines);

router.all(["/", "/*"], (req, res) => {
    return res.status(405).json(new ErrorResponseBuilder()
        .withCode(405)
        .withMessage("Invalid method for the requested fields")
        .withStatus(ErrorStatus.badInput)
        .build())
});

export default router;
