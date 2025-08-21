import Router from "express"
import {verifyJWt} from "../middlewares/auth.middleware.js"
import {toggleSubscription} from "../controllers/subscription.controllers.js"


const router = Router()
router.use(verifyJWt)

router.route("/togglesubscription/:channelId").post(toggleSubscription)


export default router