import {Router} from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {getStreamToken} from "../controllers/chat.controller.js";

const router = Router();
router.use(protectedRoute);

router.get("/token", getStreamToken);

export default router;