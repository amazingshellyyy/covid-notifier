import express from 'express';
//eable express Router
const router = express.Router();

router.get('/', (req, res) => res.send('Hello world'));


export default router;