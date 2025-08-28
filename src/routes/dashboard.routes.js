import Router from "express"
import { verifyJWt } from "../middlewares/auth.middleware.js"
import {
    getChannelStats, 
    getChannelVideos
} from "../controllers/dashboard.controllers.js"


const router = Router()

router.use(verifyJWt)
router.route("/channel-videos").get(getChannelVideos)
router.route("/channel-stats").get(getChannelStats)


export default router