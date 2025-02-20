
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

    const prompt = `Generate 20 multiple choice math questions for ${chapter}. 
    Format each question as a JSON object with these properties:
    - question (string)
    - options (array of 4 objects with id: "a"|"b"|"c"|"d" and text: string)
    - correctAnswer ("a"|"b"|"c"|"d")
    - explanation (detailed step by step solution)
    - difficulty (string: "Easy"|"Medium"|"Hard")
    Return as a JSON array of these question objects.
    Make sure to provide a good mix of difficulty levels and comprehensive coverage of the topic.`;

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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
      }),
    });

    const data = await response.json();
    const questionsText = data.candidates[0].content.parts[0].text;
    const questions = JSON.parse(questionsText.substring(
      questionsText.indexOf('['),
      questionsText.lastIndexOf(']') + 1
    ));

    return new Response(JSON.stringify({ questions }), {
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
