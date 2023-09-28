import express from "express";

const router = express.Router();

router.post("/login");
router.post("/register");

router.all(["/", "/*"], (req, res) => {
    return res.status(400).json(new ErrorResponseBuilder()
        .withCode(405)
        .withMessage("Invalid method for the requested fields")
        .withStatus(ErrorStatus.badInput)
        .build())
});

export default router;
