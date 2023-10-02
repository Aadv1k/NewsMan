import express from "express";
import { ErrorStatus, ErrorResponseBuilder } from "../../ResponseBuilder";
import { registerUser, loginUser,  } from "../../controllers/user";

const router: express.Router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.delete("/", deleteUser)

router.all(["/", "/*"], (req, res) => {
    return res.status(405).json(new ErrorResponseBuilder()
        .withCode(405)
        .withMessage("Invalid method for the requested fields")
        .withStatus(ErrorStatus.badInput)
        .build())
});

export default router;
