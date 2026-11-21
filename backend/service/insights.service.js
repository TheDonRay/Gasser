import Anthropic from '@anthropic-ai/sdk';

// Reads ANTHROPIC_API_KEY from the environment (loaded by dotenv in server.js)
const client = new Anthropic();

const MODEL = 'claude-opus-5-5';

const SYSTEM_PROMPT = `You are Gasser's pit-stop coach: a friendly, frugal driving advisor.
You get one week of the user's gas data: gallons, dollars spent, and fill-ups per day, plus how many fill-ups were Regular, Midgrade, or Premium.

Answer in plain text (the app shows it as-is, so don't use markdown headings, bold, or tables).
Keep it under about 120 words. Use short lines starting with "• " for tips.
Base every number you mention on the data given. If the data is too thin to answer, say what's missing. 

In addition make sure that you include a sound tip on a way to save or the latest saving method for someone driving`;

// Thrown for problems the controller should report with a specific status code
export class InsightError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const money = (n) => `$${n.toFixed(2)}`;

// Turn the week into a compact, readable block for the prompt
const describeWeek = (week, grades) => {
    const lines = week.map((d) => {
        const ppg = d.gallons > 0 ? `, ${money(d.spent / d.gallons)}/gal` : '';
        return `${d.day}: ${d.gallons} gal, ${money(d.spent)}, ${d.fillUps} fill-up(s)${ppg}`;
    });

    const gallons = week.reduce((s, d) => s + d.gallons, 0);
    const spent = week.reduce((s, d) => s + d.spent, 0);

    return [
        'Daily log:',
        ...lines,
        '',
        `Week total: ${gallons.toFixed(2)} gal, ${money(spent)}` +
            (gallons > 0 ? `, average ${money(spent / gallons)}/gal` : ''),
        `Fill-ups by grade: Regular ${grades.regular}, Midgrade ${grades.midgrade}, Premium ${grades.premium}`,
    ].join('\n');
};

export const generateInsight = async ({ week, grades, question }) => {
    const ask = question
        ? `My question: ${question}`
        : 'Give me a quick summary of this week and 2-3 tips to spend less on gas.';

    const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        // Short coaching answers don't need deep reasoning
        output_config: { effort: 'low' },
        // If Claude declines, the API retries on a fallback model in the same call
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: SYSTEM_PROMPT,
        messages: [
            {
                role: 'user',
                content: `${describeWeek(week, grades)}\n\n${ask}`,
            },
        ],
    });

    if (response.stop_reason === 'refusal') {
        throw new InsightError("The AI couldn't answer that one. Try rephrasing your question.", 422);
    }

    const insight = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

    if (!insight) {
        throw new InsightError('The AI returned an empty answer. Please try again.', 502);
    }

    return insight;
};
