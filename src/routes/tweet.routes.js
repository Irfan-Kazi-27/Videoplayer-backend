import Router from "express"
import {createTweet,updateTweet,deleteTweet,getUserTweets} from "../controllers/tweet.controllers.js"
import { verifyJWt } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWt)

router.route("/").post(createTweet)
router.route("/get-usertweet").get(getUserTweets)
router.route("/c/:tweetId").get(updateTweet)
router.route("/d/:tweetId").delete(deleteTweet)



export default router



