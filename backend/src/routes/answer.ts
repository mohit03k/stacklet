import { Router } from "express";
import { AskAnswer, deleteanswer } from "../controllers/answers.js";
import auth from "../middleware/auth.js";

const router = Router()

router.post("/postanswer/:id", auth, AskAnswer)
router.delete("/delete/:id", auth, deleteanswer)
export default router;
