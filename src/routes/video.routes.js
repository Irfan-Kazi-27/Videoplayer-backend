import Router from "express"
import {publishAVideo} from "../controllers/video.controllers.js"
import {verifyJWt} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWt)

router.route("/").post(upload.fields([
    {name:"videofile",maxCount:1},
    {name:"thumbnail",maxCount:1}
]),publishAVideo)

export default router