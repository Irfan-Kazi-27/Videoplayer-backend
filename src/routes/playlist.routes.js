import Router from "express"
import { verifyJWt } from "../middlewares/auth.middleware.js"
import { createPlaylist
        ,getUserPlaylists
        ,getPlaylistById
        ,addVideoToPlaylist
        ,removeVideoFromPlaylist
        ,deletePlaylist
        ,updatePlaylist
    } from "../controllers/playlist.controllers.js"

const router = Router()

router.use(verifyJWt)
router.route("/create-playlist").post(createPlaylist)
router.route("/get-userplaylist/:userId").get(getUserPlaylists)
router.route("/get-playlist/:playlistId").get(getPlaylistById)
router.route("/addVideo/:playlistId/:videoId").patch(addVideoToPlaylist)
router.route("/remove-video/:playlistId/:videoId").delete(removeVideoFromPlaylist)
router.route("/delete-playlist/:playlistId").delete(deletePlaylist)
router.route("/update-playlist/:playlistId").patch(updatePlaylist)


export default router