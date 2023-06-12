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
router.post("/", (req, res) => {
    const file = req.files?.file
    if (!req.files || !file) return res.status(400).json({ error: "No files were uploaded." });

})


export default router;

