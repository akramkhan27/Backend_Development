import { Router } from "express";
import {
    userRegister,
    userLogin,
    userLogout,
    accessRefreshToken,
    changeUserPassword,
    getCurrentUser,
    updateUserDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory

} from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJwt, userLogout);
router.route("/refresh-token").post(verifyJwt ,accessRefreshToken);
router.route("/change-password").put(verifyJwt,changeUserPassword);
router.route("/update-details").put(verifyJwt, updateUserDetails);
router.route("/get-user").get(verifyJwt ,getCurrentUser);
router.route("/update-avatar-image").put(
    verifyJwt, 
    upload.single("avatar"),
    updateAvatar
);
router.route("/update-cover-image").put(
    verifyJwt,
    upload.single("coverImage"),
    updateCoverImage
);
router.route("/get-user-channel-profile").get(verifyJwt, getUserChannelProfile);
router.route("/get-watch-history").get(verifyJwt, getWatchHistory);


export default router;