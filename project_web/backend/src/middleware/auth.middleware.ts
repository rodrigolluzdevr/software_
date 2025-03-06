import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Pega o token do header Authorization

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido no ambiente.');
    }

    try {
      // Verifica e decodifica o token com a chave secreta
      const decoded = jwt.verify(token, jwtSecret);

      // Adiciona a propriedade 'user' ao req (agora tipada corretamente)
      req.user = decoded;

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  }
}
