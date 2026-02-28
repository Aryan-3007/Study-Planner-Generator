import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai-plan", async (req, res) => {

    const studentData = req.body;

    const prompt = `
You are an academic mentor AI.

Create a smart study strategy.

Student Study Hours Per Day: ${studentData.hours}

Subjects:
${studentData.subjects.map(s =>
`${s.name} - ${s.difficulty} - ${s.syllabus}% left - exam in ${s.days} days`
).join("\n")}

Rules:
- If exam tomorrow → full revision day
- Prioritize hard subjects earlier
- Use spaced repetition
- Avoid burnout
- Give reasoning why plan is good

Return short clear plan.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    res.json({ plan: data.choices[0].message.content });
});

app.listen(3000, () => console.log("AI Server running on port 3000"));
