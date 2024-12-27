import { Router } from "express";
import { userRegister, userLogin, userLogout, accessRefreshToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    userRegister
)
router.route("/login").post(userLogin)

// secured routes
router.route("/logout").post( verifyJwt ,userLogout)
router.route("/refresh-token").post(accessRefreshToken);

export default router;