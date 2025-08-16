import Router from "express"
import {publishAVideo,
        getVideoById,
        togglePublishStatus,
        updateVideo,
        deleteVideo} from "../controllers/video.controllers.js"
import {verifyJWt} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWt)

router.route("/").post(upload.fields([
    {name:"videofile",maxCount:1},
    {name:"thumbnail",maxCount:1}
]),publishAVideo)
router.route("/getvideos/:videoId").get(getVideoById)
router.route("/isPublished/:videoId").get(togglePublishStatus)
router.route("/update-video/:videoId").patch(upload.single("thumbnail"),updateVideo)
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/get-videoIsPublished/:videoId").get(togglePublishStatus)

export default router