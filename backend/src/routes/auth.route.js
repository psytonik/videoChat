import {Router} from "express";
import {signIn, signUp, signOut, onboard, whoImAm} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";

const router = Router();

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/sign-out', signOut)
/// onboarding
router.post('/onboarding', protectedRoute, onboard);
/// check if user is logged in
router.get('/me', protectedRoute, whoImAm);


export default router;