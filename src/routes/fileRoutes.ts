import { Router } from "express";
import { getFiles } from "../handlers/file";


const router = Router()

router.get('/:filename', getFiles);
// router.delete('/:filename', deleteUploadedFile);

export default router