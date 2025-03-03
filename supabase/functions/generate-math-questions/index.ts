
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

    // Construct the request to Gemini API
    const prompt = `
      Generate 5 multiple-choice math practice problems for ${chapter} chapter. 
      Format the response as a JSON array of objects with this exact structure:
      [
        {
          "id": 1, (incremental number)
          "question": "The question text",
          "options": [
            {"id": "A", "text": "Option A text"},
            {"id": "B", "text": "Option B text"},
            {"id": "C", "text": "Option C text"},
            {"id": "D", "text": "Option D text"}
          ],
          "correctAnswer": "A", (the id of the correct option)
          "difficulty": "Easy/Medium/Hard",
          "subject": "Math",
          "chapter": "${chapter}",
          "explanation": "Step-by-step explanation of the solution"
        }
      ]
      
      Include a variety of difficulty levels. Make sure the explanation is detailed and educational.
      Ensure the JSON is valid and properly formatted. Only return the JSON array, nothing else.
    `;

    const geminiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500
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

    // Extract the JSON from the response text
    let questionsJson = textContent;
    
    // If the response contains markdown code blocks, extract the JSON
    if (textContent.includes('```json')) {
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        questionsJson = jsonMatch[1].trim();
      }
    } else if (textContent.includes('```')) {
      const jsonMatch = textContent.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        questionsJson = jsonMatch[1].trim();
      }
    }

    try {
      // Parse the extracted JSON
      const questions = JSON.parse(questionsJson);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Validate the structure of each question
      questions.forEach((q: any, index: number) => {
        if (!q.id) q.id = index + 1;
        if (!q.question || !q.options || !Array.isArray(q.options) || !q.correctAnswer || !q.explanation) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
      });
      
      console.log(`Successfully generated ${questions.length} questions`);
      
      // Return the parsed questions
      return new Response(
        JSON.stringify({ questions }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (parseError) {
      console.error('Error parsing Gemini response as JSON:', parseError, 'Response:', textContent);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Response Format', 
          message: 'Could not parse the Gemini response as valid JSON' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
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
