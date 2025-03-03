
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  question: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Construct the request to Gemini API
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful math tutor. Answer this math question or provide guidance on this math topic. Give a detailed, step-by-step explanation: ${question}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });

    // Check if the Gemini API response is successful
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorData);
      
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API Error', 
          message: `Error from Gemini API: ${response.status} ${response.statusText}` 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the Gemini API response
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Unexpected Gemini API response format', data);
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

    // Extract the text content from the response
    const textContent = data.candidates[0].content.parts[0].text || 'No answer generated';
    console.log(`Successfully generated tutor response (${textContent.length} chars)`);

    // Return the formatted answer to the client
    return new Response(
      JSON.stringify({ answer: textContent }),
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
