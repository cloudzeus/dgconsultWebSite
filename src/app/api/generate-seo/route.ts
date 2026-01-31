import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(e => {
            console.error("JSON Body Parse Error:", e);
            return null;
        });

        if (!body) {
            return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
        }

        const { title, description, content, type } = body;
        console.log("SEO Gen Request:", { title, description, type });

        if (!process.env.DEEPSEEK_API_KEY) {
            console.error("DEEPSEEK_API_KEY is missing in env");
            return NextResponse.json({ error: 'DeepSeek API Key configuration is missing. Please add DEEPSEEK_API_KEY to your .env file.' }, { status: 500 });
        }

        console.log("Using API Key starting with:", process.env.DEEPSEEK_API_KEY.substring(0, 5) + "...");

        const prompt = `You are an expert SEO specialist for "DGCONSULT", a Digital Transformation Consultancy in Greece (AgTech, IoT, Industry 4.0).
    
    Please generate an optimized Meta Title and Meta Description in Greek based on the following content.
    
    Context:
    Type: ${type}
    Title: ${title}
    Description: ${description}
    Content Snippet: ${content ? content.substring(0, 800) : ''}
    
    Requirements:
    - Meta Title: Max 60 characters. Professional, includes main keyword.
    - Meta Description: Max 155 characters. Compelling summary for click-through rate.
    - Output strictly valid JSON with keys: "metaTitle", "metaDescription".
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
                    { role: "system", content: "You are an SEO assistant. Output only valid JSON." },
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
        console.log("DeepSeek Raw Response:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Unexpected DeepSeek Response Structure:", data);
            return NextResponse.json({ error: 'AI returned an unexpected response structure.' }, { status: 500 });
        }

        const contentText = data.choices[0].message.content;
        console.log("AI Content Text:", contentText);

        // Attempt to parse JSON
        let result;
        try {
            // Clean markdown code blocks if present
            const jsonStr = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
            result = JSON.parse(jsonStr);
        } catch (e) {
            console.error("JSON Parse Error:", contentText);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Generate SEO Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
