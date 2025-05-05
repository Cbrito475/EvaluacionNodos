// routes/careerRoutes.js
import express from 'express';
import {
    createNode,
    getAllFathers,
    getNodeByFather,
    deleteNode,
    clearAllNodes,
} from '../controllers/NodeController.js';

const router = express.Router();

router.post('/nodes/', createNode); // Crea el nodo y lo guarda en la base de datos
router.post('/nodes/roots', getAllFathers); // Mejor nombre para nodos raíz
router.post('/nodes/children/', getNodeByFather); // Usar GET con parámetro
router.delete('/nodes/delete', deleteNode);
router.delete('/nodes/clear-all', clearAllNodes);
export default router;