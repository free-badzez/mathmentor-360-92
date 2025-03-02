
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  chapter: string;
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
    const { chapter } = requestData;
    
    if (!chapter) {
      console.error('No chapter provided in request');
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Chapter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating math questions for chapter: ${chapter}`);

    // Construct the prompt for generating questions
    const prompt = `
      Generate 5 multiple-choice math practice problems for ${chapter}.
      Format the response as a valid JSON array of objects with the following structure:
      
      {
        "questions": [
          {
            "id": 1,
            "question": "The question text",
            "options": [
              {"id": "A", "text": "First option"},
              {"id": "B", "text": "Second option"},
              {"id": "C", "text": "Third option"},
              {"id": "D", "text": "Fourth option"}
            ],
            "correctAnswer": "A",
            "explanation": "Explanation of the correct answer",
            "difficulty": "Easy/Medium/Hard",
            "subject": "Mathematics",
            "chapter": "${chapter}"
          },
          ... more questions
        ]
      }
      
      Only return the JSON without any additional text or formatting.
    `;

    // Make request to Gemini API
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
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
    const textContent = data.candidates[0].content.parts[0].text || '';
    console.log(`Received response from Gemini API (${textContent.length} chars)`);

    // Find and extract the JSON part
    let jsonText = textContent;
    if (textContent.includes('{')) {
      jsonText = textContent.substring(textContent.indexOf('{'));
      if (jsonText.lastIndexOf('}') !== -1) {
        jsonText = jsonText.substring(0, jsonText.lastIndexOf('}') + 1);
      }
    }

    // Parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
      console.log(`Successfully parsed JSON with ${parsedData.questions?.length || 0} questions`);
    } catch (jsonError) {
      console.error('Error parsing JSON from Gemini response:', jsonError);
      console.log('Raw text received:', textContent);
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON', 
          message: 'Failed to parse valid JSON from the Gemini API response' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the questions to the client
    return new Response(
      JSON.stringify(parsedData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error generating math questions:', error);
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
