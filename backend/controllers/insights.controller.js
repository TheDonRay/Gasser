import Anthropic from '@anthropic-ai/sdk';
import { generateInsight, InsightError } from '../service/insights.service.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GRADES = ['regular', 'midgrade', 'premium'];
const MAX_QUESTION_LENGTH = 500;

const isCount = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;

// Returns an error message, or null when the body is valid
const validateBody = ({ week, grades, question }) => {
    if (!Array.isArray(week) || week.length !== 7) {
        return '`week` must be an array of 7 days.';
    }
    for (const d of week) {
        if (!d || !DAYS.includes(d.day)) return 'Each day needs a `day` of Mon-Sun.';
        if (!isCount(d.gallons) || !isCount(d.spent) || !isCount(d.fillUps)) {
            return `${d.day}: gallons, spent and fillUps must be non-negative numbers.`;
        }
    }

    if (!grades || !GRADES.every((g) => isCount(grades[g]))) {
        return '`grades` must have non-negative regular, midgrade and premium counts.';
    }

    if (question !== undefined) {
        if (typeof question !== 'string') return '`question` must be a string.';
        if (question.length > MAX_QUESTION_LENGTH) {
            return `\`question\` must be ${MAX_QUESTION_LENGTH} characters or fewer.`;
        }
    }

    return null;
};

export const insightsControllerFunction = async (req, res) => {
    try {
        const { week, grades, question } = req.body ?? {};

        const problem = validateBody({ week, grades, question });
        if (problem) {
            return res.status(400).json({ error: problem });
        }

        const insight = await generateInsight({
            week,
            grades,
            question: question?.trim() || undefined,
        });

        return res.status(200).json({ insight });
    } catch (error) {
        if (error instanceof InsightError) {
            return res.status(error.status).json({ error: error.message });
        }
        if (error instanceof Anthropic.AuthenticationError) {
            console.error('Anthropic rejected the API key. Check ANTHROPIC_API_KEY in backend/.env.');
            return res.status(500).json({ error: 'The server’s AI key is invalid.' });
        }
        if (error instanceof Anthropic.RateLimitError) {
            return res.status(429).json({ error: 'Too many requests. Wait a moment and try again.' });
        }
        if (error instanceof Anthropic.APIConnectionError) {
            return res.status(503).json({ error: 'Couldn’t reach the AI service. Try again shortly.' });
        }
        if (error instanceof Anthropic.APIError) {
            console.error(`Anthropic API error ${error.status}:`, error.message);
            return res.status(502).json({ error: 'The AI service had a problem. Try again shortly.' });
        }

        console.error('Unexpected error in /api/insights:', error);
        return res.status(500).json({ error: 'Something went wrong on the server.' });
    }
};
