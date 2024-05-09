import express from 'express';
import { postItem, getItemById, getItems, deleteItem, updateItem } from '../Contex/ItemContex.js';

const router = express.Router();


router.post('/', postItem);

router.get('/', getItems);

router.get('/:itemid', getItemById);

router.delete('/:itemid', deleteItem);

router.put('/:itemid', updateItem);

export default router;
