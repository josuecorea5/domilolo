import { verifyJWT } from '../utils/createJWT';

export const protectRoutes = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const [ , token] = bearer.split(" ");

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = verifyJWT(token);
    req.user = user;
    if(req.user.role !== "ADMIN"){
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
