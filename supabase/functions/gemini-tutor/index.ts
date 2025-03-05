
// This edge function connects to the Gemini API to process math questions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  question: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle the function check request (GET)
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'ok', message: 'Gemini Tutor service is available' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  // Get API key from environment
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return new Response(
      JSON.stringify({ 
        error: 'GEMINI_API_KEY not configured', 
        message: 'Please add the GEMINI_API_KEY to the Supabase Edge Function secrets'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Parse the request body
    const requestData = await req.json() as RequestBody;
    const { question } = requestData;
    
    if (!question) {
      console.error('No question provided in request');
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Question is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing math tutor request: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`);

    // Construct the request to the Gemini API
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    console.log("Sending request to Gemini API");
    const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful math tutor. Answer this math question or provide guidance on this math topic. Give a detailed, step-by-step explanation: ${question}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        }
      })
    });

    console.log(`Gemini API status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorText);
      
      let errorMessage = `Error from Gemini API: ${response.status} ${response.statusText}`;
      
      // Try to extract a more detailed error message if available
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error && errorJson.error.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // If parsing fails, just use the original error message
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API Error', 
          message: errorMessage 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response format:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected Response', 
          message: 'Unexpected response format from Gemini API' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const answer = data.candidates[0].content.parts[0].text;
    console.log(`Successfully generated tutor response (${answer.length} chars)`);

    return new Response(
      JSON.stringify({ answer }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing AI tutor request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
