import express from "express";
import { ErrorStatus, ErrorResponseBuilder } from "../../ResponseBuilder";
import { createKey, deleteKey, cycleKey } from "../../controllers/key";

const router: express.Router = express.Router();

router.post("/", createKey);
router.delete("/:keyid", deleteKey)
router.patch("/:keyid", cycleKey);

router.all(["/", "/*"], (req, res) => {
    return res.status(405).json(new ErrorResponseBuilder()
        .withCode(405)
        .withMessage("Invalid method for the requested fields")
        .withStatus(ErrorStatus.badInput)
        .build())
});

export default router;
