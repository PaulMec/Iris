const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Obtener el token del header de autorización
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, se requiere un token' });
  }

  try {
    // Verificar el token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Añadir el usuario verificado al request
    next(); // Continuar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = auth;
