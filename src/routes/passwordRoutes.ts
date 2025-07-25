import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { addPassword, deletePassword, getPasswords, updatePassword } from "../handlers/password";

const router = Router()
router.use(verifyToken);

 router.post('/', addPassword);
router.put('/:id', updatePassword);
router.get('/', getPasswords);
router.delete('/:id', deletePassword);

export default router