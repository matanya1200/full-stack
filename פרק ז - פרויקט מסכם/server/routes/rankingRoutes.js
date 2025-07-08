const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankingController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken); // כל הקריאות מחייבות התחברות

router.post('/', rankController.addRank);                
router.get('/', rankController.getAllRanks);   
router.get('/product/:product_id', rankController.getRanksByProduct);
router.get('/product/:product_id/average', rankController.getAverageRating);          
router.get('/:user_id', rankController.getRanksByUser);  
router.put('/:id', rankController.updateRank);           
router.delete('/:id', rankController.deleteRank);        

module.exports = router;
