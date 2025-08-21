import Router from "express"
import { verifyJWt } from "../middlewares/auth.middleware.js"
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controllers.js"


const router = Router()

router.use(verifyJWt)
router.route("/toggle-liked-video/:videoId").post(toggleVideoLike)
router.route("/toggle-liked-comment/:commentId").post(toggleCommentLike)
router.route("/toggle-liked-tweet/:tweetId").post(toggleTweetLike)
router.route("/get-Userliked-Video").get(getLikedVideos)



export default router