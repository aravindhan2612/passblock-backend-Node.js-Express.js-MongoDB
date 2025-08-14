import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { addPassword, deletePassword, getPasswords, updatePassword, getPassword } from "../handlers/password";

const router = Router()
router.use(verifyToken);

router.post('/add', addPassword);
router.put('/update/:id', updatePassword);
router.get('/', getPasswords);
router.get('/:id', getPassword);
router.delete('/delete/:id', deletePassword);


export default router