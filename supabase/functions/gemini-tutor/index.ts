
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
    const { question } = await req.json();
    console.log("Received question:", question);

    if (!question || typeof question !== 'string') {
      throw new Error("Invalid question format. Expected a string.");
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a precise and accurate math tutor. The student has asked this math question: "${question}"

Respond in this exact format with NO unnecessary line breaks between sections:

FINAL ANSWER: [Provide the precise final answer first]

TYPE OF PROBLEM: [Briefly state the type of math problem]

SOLUTION STEPS:
1. [First step with clear calculation]
2. [Next step]
[Continue with numbered steps as needed]

KEY CONCEPTS:
• [List relevant formulas used]
• [List relevant rules applied]

EXPLANATION:
[Brief explanation of why this approach works]

Make sure to:
1. Give the most accurate answer possible
2. Show clear, concise steps without extra spacing
3. Use proper mathematical notation
4. Validate all calculations twice
5. If dealing with decimals, round to 3 decimal places unless specified otherwise`
          }]
        }],
        generationConfig: {
          temperature: 0.1, // Low temperature for maximum precision
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error response:", errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Gemini API response structure:", JSON.stringify(data, null, 2).substring(0, 200) + "...");
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid response format:", JSON.stringify(data, null, 2));
      throw new Error('Invalid response format from Gemini API');
    }

    const answer = data.candidates[0].content.parts[0].text;
    console.log("Generated answer:", answer.substring(0, 100) + "...");

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error in gemini-tutor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Please try again with a different question or contact support if the issue persists."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
