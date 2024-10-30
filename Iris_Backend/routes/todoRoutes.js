const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

// Obtener todas las tareas con filtro opcional
router.get('/', auth, async (req, res) => {
  const status = req.query.status; // Para filtrar por 'pendiente' o 'completada'
  let query = {};
  if (status) {
    query.status = status;
  }

  try {
    const todos = await Todo.find(query);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener una tarea por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'No se encontró la tarea' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva tarea
router.post('/', auth, async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar una tarea
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'No se encontró la tarea' });
    }
    if (req.body.title != null) {
      todo.title = req.body.title;
    }
    if (req.body.description != null) {
      todo.description = req.body.description;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar el estado de la tarea
router.patch('/:id/completed', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'No se encontró la tarea' });
    }

    todo.completed = !todo.completed; // Cambiar el estado de completado
    todo.status = todo.completed ? 'completada' : 'pendiente';
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una tarea
router.delete('/:id', auth, async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo == null) {
        return res.status(404).json({ message: 'No se encontró la tarea' });
      }
  
      await Todo.deleteOne({ _id: req.params.id });
      res.json({ message: 'Tarea eliminada' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
