import Router from "express"
import {getVideoComments, 
    addComment, 
    updateComment,
    deleteComment} from "../controllers/comment.controllers.js"
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWt)

router.route("/:videoId").post(addComment)
router.route("/get-Usercomment/:videoId").get(getVideoComments)
router.route("/update-Usercomment/:commentId").patch(updateComment)
router.route("/delete-Usercomment/:commentId").delete(deleteComment)


export default router