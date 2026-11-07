import { Router } from "express";
import { Askquestion, getallquestion, getquestion, deletequestion, votequestion } from "../controllers/question.js";
import auth from "../middleware/auth.js";
const router = Router();
router.post("/ask", auth, Askquestion);
router.get("/getallquestion", getallquestion);
router.get("/getquestion/:id", getquestion);
router.delete("/delete/:id", auth, deletequestion);
router.patch("/vote/:id", auth, votequestion);
export default router;
//# sourceMappingURL=question.js.map