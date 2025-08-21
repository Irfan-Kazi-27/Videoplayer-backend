import Router from "express"
import {verifyJWt} from "../middlewares/auth.middleware.js"
import {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels} from "../controllers/subscription.controllers.js"


const router = Router()
router.use(verifyJWt)

router.route("/togglesubscription/:channelId").post(toggleSubscription)
router.route("/channel-Subscriber/:channelId").get(getUserChannelSubscribers)
router.route("/User-Subscribed/:subscriberId").get(getSubscribedChannels)

export default router