
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set");
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chapter } = await req.json();
    console.log("Generating questions for chapter:", chapter);

    if (!chapter || typeof chapter !== 'string') {
      throw new Error("Invalid chapter format. Expected a string.");
    }

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

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error response:", errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Gemini API response received");
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid response format:", JSON.stringify(data, null, 2));
      throw new Error('Invalid response format from Gemini API');
    }
    
    const questionsText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON array from the response text
    let jsonString = "";
    try {
      // Find the start and end of the JSON array
      const startIndex = questionsText.indexOf('[');
      const endIndex = questionsText.lastIndexOf(']') + 1;
      
      if (startIndex === -1 || endIndex === 0) {
        throw new Error("Could not find JSON array in response");
      }
      
      jsonString = questionsText.substring(startIndex, endIndex);
      console.log("Extracted JSON string length:", jsonString.length);
      
      const questions = JSON.parse(jsonString);
      
      // Add IDs to questions
      const questionsWithIds = questions.map((q, index) => ({
        ...q,
        id: index + 1
      }));

      return new Response(JSON.stringify({ questions: questionsWithIds }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("JSON string excerpt:", jsonString.substring(0, 200) + "...");
      throw new Error(`Failed to parse questions: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-math-questions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Please try again with a different chapter or contact support if the issue persists."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
