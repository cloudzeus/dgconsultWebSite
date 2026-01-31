import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { title, description } = await req.json();

        if (!process.env.DEEPSEEK_API_KEY) {
            return NextResponse.json({ error: 'DeepSeek API Key configuration is missing.' }, { status: 500 });
        }

        const prompt = `You are an expert strategic business consultant and technical writer for "DGCONSULT", a Digital Transformation Consultancy in Greece.
    
    Target Sector: ${title}
    Brief Overview: ${description}

    Please generate a professional, deep-dive content structure for this sector in GREEK.
    The response must be a VALID JSON object with the following structure:
    {
        "executiveSummary": "A high-level summary of how DGCONSULT transforms this sector.",
        "challenges": [
            { "title": "Challenge Name", "description": "Short explanation of the pain point" }
        ],
        "solutions": [
            { "title": "Our Approach", "description": "How we solve it with tech/AI/consulting" }
        ],
        "benefits": [
            { "title": "Benefit", "description": "Measurable value" }
        ],
        "futureOutlook": "A visionary closing statement about where this sector is heading with digital innovation."
    }

    Requirements:
    - Tone: Professional, authoritative, innovative.
    - Language: Greek.
    - Quantity: 3-4 items for challenges, solutions, and benefits.
    - Output: ONLY the JSON object.
    `;

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a professional business consultant. Output only valid JSON." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DeepSeek Error:", errorText);
            return NextResponse.json({ error: `DeepSeek API Error: ${response.status}` }, { status: 500 });
        }

        const data = await response.json();
        const contentText = data.choices[0].message.content;

        let result;
        try {
            const jsonStr = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
            result = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON Parse Error:", contentText);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Generate Sector Content Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
