import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { aiService } from '../services/ai.service.js';
import { mockResumesDB } from './resume.controller.js';

export async function analyzeSkillGap(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { targetRole = 'Software Engineer', userSkills } = req.body;
    let skillsList: string[] = userSkills;

    if (!skillsList || !Array.isArray(skillsList)) {
      const userResumes = Array.from(mockResumesDB.values());
      if (userResumes.length > 0 && userResumes[0].parsedData?.skills) {
        skillsList = userResumes[0].parsedData.skills;
      } else {
        skillsList = ['React', 'TypeScript', 'Node.js', 'Git', 'REST API', 'SQL', 'HTML5', 'CSS3'];
      }
    }

    const roadmap = await aiService.getSkillGapRoadmap(skillsList, targetRole);

    res.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
}
