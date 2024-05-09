

import express from 'express';
import { addAddress, getAddress,  updateAddress } from '../Contex/AddressContex.js';

const router = express.Router();

router.post('/post', addAddress);
router.get('/get/:user', getAddress);


router.put('/up/:adderssid', updateAddress); 

export default router;
