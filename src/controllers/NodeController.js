import Node from '../models/Node.js';
import { translateNumber } from '../utils/translator.js';
import { formatDate } from '../utils/dateFormatter.js';

/**
 * @swagger
 * /nodes:
 *   post:
 *     summary: Crea un nuevo nodo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID numérico del nodo
 *               parent:
 *                 type: string
 *                 description: ID del nodo padre (opcional)
 *     responses:
 *       201:
 *         description: Nodo creado exitosamente
 */
/**
 * @swagger
 * /nodes:
 *   post:
 *     summary: Crea un nuevo nodo en el árbol binario de búsqueda
 *     description: |
 *       Inserta el nodo manteniendo las propiedades de ABB:
 *       - Valores menores que el nodo actual van a la izquierda (primer hijo)
 *       - Valores mayores que el nodo actual van a la derecha (segundo hijo)
 *       - Si un nodo ya tiene 2 hijos, continúa la búsqueda recursivamente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID numérico único del nodo
 *     responses:
 *       201:
 *         description: Nodo creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: ID ya existe
 */
export const createNode = async (req, res) => {
    try {
      const { id } = req.body;
      const language = req.headers['accept-language'] || 'en';
  
      // Validaciones básicas
      if (!id && id !== 0) {
        return res.status(400).json({ 
          success: false,
          message: "El campo 'id' es requerido" 
        });
      }
  
      if (await Node.exists({ id })) {
        return res.status(409).json({
          success: false,
          message: `El ID ${id} ya existe en el árbol`
        });
      }
  
      // Obtener la raíz
      let root = await Node.findOne({ parent: null });
  
      // Si no existe raíz, crear el primer nodo
      if (!root) {
        const newNode = await Node.create({
          id,
          parent: null,
          title: translateNumber(id, language),
          created_at: new Date()
        });
        return res.status(201).json({
          success: true,
          data: {
            id: newNode.id,
            title: newNode.title,
            parent: null,
            created_at: newNode.created_at
          }
        });
      }
  
      // Función para encontrar el padre adecuado
      const findSuitableParent = async (currentNode) => {
        const children = await Node.find({ parent: currentNode._id }).sort({ id: 1 });
  
        // Caso 1: El nodo no tiene hijos
        if (children.length === 0) {
          return currentNode;
        }
  
        // Caso 2: El nodo tiene 1 hijo
        if (children.length === 1) {
          // Si el nuevo id es menor que el hijo existente y menor que el padre
          if (id < currentNode.id && id < children[0].id) {
            return currentNode;
          }
          // Si el nuevo id es mayor que el hijo existente y mayor que el padre
          if (id > currentNode.id && id > children[0].id) {
            return currentNode;
          }
          // Si no, continuar con el hijo adecuado
          return await findSuitableParent(children[0]);
        }
  
        // Caso 3: El nodo ya tiene 2 hijos
        if (id < currentNode.id) {
          return await findSuitableParent(children[0]); // Ir al hijo izquierdo
        } else {
          return await findSuitableParent(children[1]); // Ir al hijo derecho
        }
      };
  
      // Encontrar el padre adecuado
      const suitableParent = await findSuitableParent(root);
  
      // Crear el nuevo nodo
      const newNode = await Node.create({
        id,
        parent: suitableParent._id,
        title: translateNumber(id, language),
        created_at: new Date()
      });

      // Obtener el ID numérico del padre
      const parentNode = await Node.findById(suitableParent._id);
  
      res.status(201).json({
        success: true,
        data: {
          id: newNode.id,
          title: newNode.title,
          parent: parentNode.id,
          created_at: newNode.created_at
        }
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear nodo",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};

/**
 * @swagger
 * /nodes/roots:
 *   post:
 *     summary: Obtiene todos los nodos padre del árbol
 *     description: |
 *       Retorna nodos raíz (parent=null) y nodos con hijos,
 *       con traducción y formato de fecha según parámetros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 example: es
 *                 description: Código ISO 639-1 para traducción
 *               timezone:
 *                 type: string
 *                 example: America/Mexico_City
 *                 description: Zona horaria para formato de fecha
 *     responses:
 *       200:
 *         description: Lista de nodos padre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Node'
 *       400:
 *         description: Cuerpo de solicitud inválido
 */
export const getAllFathers = async (req, res) => {
    try {
        // Validar que venga el cuerpo de la solicitud
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Se requiere un cuerpo JSON con los parámetros"
            });
        }

        // Obtener parámetros con valores por defecto
        const { language = 'en', timezone = 'UTC' } = req.body;

        // 1. Obtener nodos raíz o con hijos con información del padre
        const parentNodes = await Node.aggregate([
            {
                $lookup: {
                    from: 'nodes',
                    localField: '_id',
                    foreignField: 'parent',
                    as: 'children'
                }
            },
            {
                $lookup: {
                    from: 'nodes',
                    localField: 'parent',
                    foreignField: '_id',
                    as: 'parentData'
                }
            },
            {
                $match: {
                    $or: [
                        { parent: null },
                        { 'children.0': { $exists: true } }
                    ]
                }
            },
            {
                $addFields: {
                    parentId: { $arrayElemAt: ['$parentData.id', 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    parentData: 0,
                    __v: 0
                }
            },
            {
                $sort: { id: 1 }
            }
        ]);

        // 2. Formatear respuesta
        const formattedNodes = parentNodes.map(node => ({
            id: node.id,
            title: translateNumber(node.id, language),
            parent: node.parentId || null,
            created_at: formatDate(node.created_at, timezone),
            children_count: node.children.length
        }));

        // 3. Enviar respuesta
        res.status(200).json({
            success: true,
            count: formattedNodes.length,
            data: formattedNodes
        });

    } catch (error) {
        console.error('Error en getAllFathers:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener nodos padres",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @swagger
 * /nodes/children:
 *   post:
 *     summary: Obtiene nodos hijos con profundidad configurable
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentId
 *             properties:
 *               parentId:
 *                 type: integer
 *                 example: 50
 *               language:
 *                 type: string
 *                 example: es
 *               timezone:
 *                 type: string
 *                 example: America/Mexico_City
 *               depth:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Subárbol encontrado
 *       400:
 *         description: Faltan parámetros requeridos
 *       404:
 *         description: Nodo padre no existe
 */
export const getNodeByFather = async (req, res) => {
    try {
        const { parentId, language = 'en', timezone = 'UTC', depth } = req.body;

        // Validación de parámetros
        if (parentId === undefined || parentId === null) {
            return res.status(400).json({
                success: false,
                message: "El parámetro 'parentId' es requerido en el cuerpo JSON"
            });
        }

        // Buscar nodo padre
        const parentNode = await Node.findOne({ id: parentId });
        if (!parentNode) {
            return res.status(404).json({
                success: false,
                message: `Nodo padre con ID ${parentId} no encontrado`
            });
        }

        // Función recursiva para construir el subárbol
        const buildSubtree = async (node, currentDepth = 0) => {
            // Obtener el ID numérico del padre
            const parent = node.parent ? await Node.findById(node.parent) : null;

            const nodeData = {
                id: node.id,
                title: translateNumber(node.id, language),
                parent: parent?.id || null,
                created_at: formatDate(node.created_at, timezone)
            };

            // Obtener hijos si no se alcanzó la profundidad máxima
            if (depth === undefined || currentDepth < depth) {
                const children = await Node.find({ parent: node._id }).sort({ id: 1 });
                if (children.length > 0) {
                    nodeData.children = await Promise.all(
                        children.map(child => buildSubtree(child, currentDepth + 1))
                      )
                      }
            }

            return nodeData;
        };

        const treeData = await buildSubtree(parentNode);
        
        res.status(200).json({
            success: true,
            data: treeData
        });

    } catch (error) {
        console.error('Error en getNodeByFather:', error);
        res.status(500).json({
            success: false,
            message: "Error interno al procesar la solicitud",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @swagger
 * /nodes/delete:
 *   post:
 *     tags: [Nodes]
 *     summary: Elimina un nodo por su ID (recibido en body)
 *     description: Elimina un nodo solo si no tiene hijos, recibiendo el ID en el cuerpo JSON
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Nodo eliminado exitosamente
 *       400:
 *         description: No se puede eliminar (tiene hijos o falta ID)
 *       404:
 *         description: Nodo no encontrado
 */
export const deleteNode = async (req, res) => {
  try {
      // 1. Obtener ID del body
      const { id } = req.body;

      // Validación manual básica
      if (id === undefined || id === null) {
          return res.status(400).json({
              success: false,
              message: "Debe proporcionar un ID en el cuerpo JSON"
          });
      }

      // 2. Buscar nodo
      const nodeToDelete = await Node.findOne({ id: Number(id) });
      if (!nodeToDelete) {
          return res.status(404).json({
              success: false,
              message: `Nodo con ID ${id} no encontrado`
          });
      }

      // 3. Verificar hijos
      const hasChildren = await Node.exists({ parent: nodeToDelete._id });
      if (hasChildren) {
          return res.status(400).json({
              success: false,
              message: `No se puede eliminar el nodo ${id} porque tiene hijos`
          });
      }

      // 4. Obtener referencia al padre para la respuesta
      let parentId = null;
      if (nodeToDelete.parent) {
          const parent = await Node.findById(nodeToDelete.parent);
          parentId = parent?.id || null;
      }

      // 5. Eliminar
      await Node.deleteOne({ _id: nodeToDelete._id });

      // 6. Responder
      res.status(200).json({
          success: true,
          message: `Nodo ${id} eliminado correctamente`,
          deleted: {
              id: nodeToDelete.id,
              parent: parentId
          }
      });

  } catch (error) {
      console.error('Error eliminando nodo:', error);
      res.status(500).json({
          success: false,
          message: "Error interno al eliminar nodo",
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};

/**
 * @swagger
 * /nodes/clear-all:
 *   delete:
 *     summary: Elimina todos los nodos (solo para desarrollo)
 *     responses:
 *       200:
 *         description: Todos los nodos eliminados
 *       403:
 *         description: Solo disponible en entorno de desarrollo
 */
export const clearAllNodes = async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ 
            success: false, 
            message: 'Esta operación solo está disponible en entorno de desarrollo' 
        });
    }

    try {
        await Node.deleteMany({});
        res.status(200).json({ 
            success: true, 
            message: 'Todos los nodos han sido eliminados' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar nodos',
            error: error.message 
        });
    }
};