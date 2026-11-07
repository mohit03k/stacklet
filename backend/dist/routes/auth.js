import { Router } from "express";
import { getAllUsers, getUser, Login, Signup, updateprofile } from "../controllers/auth.js";
import auth from "../middleware/auth.js";
const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getallusers", getAllUsers);
router.get("/getuser/:id", getUser);
router.patch("/update/:id", auth, updateprofile);
export default router;
//# sourceMappingURL=auth.js.map