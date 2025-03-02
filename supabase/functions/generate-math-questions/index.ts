
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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
    // Check if API key is set
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "API key configuration error", 
          details: "The Gemini API key is not configured. Please set it in Supabase Edge Function secrets."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { chapter } = await req.json();
    console.log("Generating questions for chapter:", chapter);

    if (!chapter || typeof chapter !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid chapter format. Expected a string." }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const prompt = `Generate 5 multiple choice math questions for ${chapter}, specifically:
    - 2 Easy questions
    - 2 Medium questions
    - 1 Hard question
    
    Format each question as a JSON object with these properties:
    - question (string, keep it concise)
    - options (array of 4 objects with id: "a"|"b"|"c"|"d" and text: string)
    - correctAnswer ("a"|"b"|"c"|"d")
    - explanation (brief but clear step-by-step solution)
    - difficulty (string: "Easy"|"Medium"|"Hard")
    - subject (string: include the general math subject like "Algebra", "Geometry", etc.)
    - chapter (string: the specific chapter like "${chapter}")
    
    Make sure the questions are focused and practical. Return as a clean JSON array without any additional text, explanation, or code formatting.`;

    console.log("Sending request to Gemini API");
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
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error response:", errorData);
      return new Response(
        JSON.stringify({ 
          error: `Gemini API error: ${response.status}`, 
          details: errorData
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log("Gemini API response received");
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid response format:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response format from Gemini API',
          details: JSON.stringify(data)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const questionsText = data.candidates[0].content.parts[0].text;
    console.log("Response text length:", questionsText.length);
    
    // Extract JSON array from the response text
    try {
      // Try different methods to extract JSON
      let jsonString = "";
      let questions = null;
      
      // Method 1: Look for array brackets
      const startIndex = questionsText.indexOf('[');
      const endIndex = questionsText.lastIndexOf(']') + 1;
      
      if (startIndex !== -1 && endIndex > 0) {
        jsonString = questionsText.substring(startIndex, endIndex);
        console.log("Extracted JSON using array brackets method");
        try {
          questions = JSON.parse(jsonString);
        } catch (e) {
          console.log("Method 1 failed, trying alternative methods");
        }
      }
      
      // Method 2: Try to extract from code blocks if Method 1 failed
      if (!questions) {
        const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
        const match = questionsText.match(codeBlockRegex);
        if (match && match[1]) {
          jsonString = match[1].trim();
          console.log("Extracted JSON from code block");
          try {
            questions = JSON.parse(jsonString);
          } catch (e) {
            console.log("Method 2 failed");
          }
        }
      }
      
      // Method 3: Last resort - try to parse the whole text
      if (!questions) {
        try {
          questions = JSON.parse(questionsText);
          console.log("Parsed entire response as JSON");
        } catch (e) {
          console.error("All JSON parsing methods failed");
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      if (!questions || !Array.isArray(questions)) {
        throw new Error("Extracted content is not a valid array");
      }
      
      console.log(`Successfully parsed ${questions.length} questions`);
      
      // Add IDs to questions
      const questionsWithIds = questions.map((q, index) => ({
        ...q,
        id: index + 1
      }));

      return new Response(
        JSON.stringify({ questions: questionsWithIds }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("JSON string excerpt:", questionsText.substring(0, 500) + "...");
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to parse questions: ${parseError.message}`,
          details: "The AI generated invalid JSON. Please try again."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in generate-math-questions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An unexpected error occurred. Please try again or contact support."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
