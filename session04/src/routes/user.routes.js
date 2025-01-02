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
router.route("/update-user-details").patch(verifyJwt, updateUserDetails);
router.route("/current-user").get(verifyJwt ,getCurrentUser);
router.route("/update-avatar").patch(
    verifyJwt, 
    upload.single("avatar"),
    updateAvatar
);
router.route("/update-cover").patch(
    verifyJwt,
    upload.single("coverImage"),
    updateCoverImage
);
router.route("/user-channel-profile/:userName").get(verifyJwt, getUserChannelProfile);
router.route("/watch-history").get(verifyJwt, getWatchHistory);


export default router;