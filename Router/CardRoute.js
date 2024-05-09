import express from 'express';
import { postCard, getCards, updateCardQuantity, deleteCard,  } from '../Contex/CardContex.js';

const router = express.Router();

router.post('/post', postCard);
router.get('/get/:user', getCards);
router.put('/up/:idcard', updateCardQuantity);
router.delete('/del/:idcard', deleteCard);


export default router;
