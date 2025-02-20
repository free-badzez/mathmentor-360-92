
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chapter } = await req.json();

    const prompt = `Generate 10 multiple choice math questions for ${chapter}, specifically:
    - 4 Easy questions
    - 4 Medium questions
    - 2 Hard questions
    
    Format each question as a JSON object with these properties:
    - question (string, keep it concise)
    - options (array of 4 objects with id: "a"|"b"|"c"|"d" and text: string)
    - correctAnswer ("a"|"b"|"c"|"d")
    - explanation (brief but clear step-by-step solution)
    - difficulty (string: "Easy"|"Medium"|"Hard")
    
    Make sure the questions are focused and practical. Return as a JSON array.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    const questionsText = data.candidates[0].content.parts[0].text;
    const questions = JSON.parse(questionsText.substring(
      questionsText.indexOf('['),
      questionsText.lastIndexOf(']') + 1
    ));

    // Add IDs to questions
    const questionsWithIds = questions.map((q: any, index: number) => ({
      ...q,
      id: index + 1
    }));

    return new Response(JSON.stringify({ questions: questionsWithIds }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
