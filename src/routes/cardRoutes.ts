import { Router} from 'express';
import { verifyToken } from '../middleware/auth';
import { addCard, updateCard, getCards } from '../handlers/card';

const router = Router();

router.use(verifyToken);

 router.post('/', addCard);
router.put('/:id', updateCard);
router.get('/', getCards);

export default router;