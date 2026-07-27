import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';

export async function enhanceBulletPoints(req: Request, res: Response, next: NextFunction) {
  try {
    const { bullets, targetRole } = req.body;
    if (!bullets || !Array.isArray(bullets)) {
      return res.status(400).json({ success: false, message: 'Bullets array is required' });
    }
    const enhanced = await aiService.enhanceBulletPoints(bullets, targetRole);
    res.json({ success: true, data: enhanced });
  } catch (error) {
    next(error);
  }
}

export async function generateSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { parsedData, targetRole } = req.body;
    const summary = await aiService.generateSummary(parsedData || {}, targetRole);
    res.json({ success: true, data: { summary } });
  } catch (error) {
    next(error);
  }
}

export async function chatAssistant(req: Request, res: Response, next: NextFunction) {
  try {
    const { messages, userMessage } = req.body;
    if (!userMessage) return res.status(400).json({ success: false, message: 'User message required' });
    const reply = await aiService.chatAssistant(messages || [], userMessage);
    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
}
