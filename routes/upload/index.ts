import { Router } from "express";
import os from "os";
import fileUpload from "express-fileupload";

const router = Router();

/**
 * ? Router Use
 * * This initializes the `express-fileupload` middleware for this router
 */
router.use(fileUpload());


/**
 * @route   GET /
 * ? Status Route
 * @access  Public
 * @returns {Object} Info
 * * 
*/
router.post("/", async (req, res) => {
    if (!req.headers.token) return res.status(400).json({ error: "No token provided." })

    const user = await req.db.user.findFirst({
        where: {
            uploadToken: req.headers.token as string
        }
    })
    if (!user) return res.status(400).json({ error: "Invalid token." })

    let files = req.files?.file
    if (!req.files || !files) return res.status(400).json({ error: "No files were uploaded." });

    if (!Array.isArray(files)) files = [files]

    const response = [
        {
            url: `https:///i/hotGayFurryShit`,
        }
    ]

    res.json(response.length === 1 ? response[0] : response)
})


export default router;

