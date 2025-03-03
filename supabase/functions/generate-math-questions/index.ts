
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

    console.log(`Generating math questions for chapter: "${chapter}"`);

    // Generate mock questions for testing
    const questions = generateMockQuestions(chapter);
    
    console.log(`Successfully generated ${questions.length} questions for ${chapter}`);

    // Return the generated questions
    return new Response(
      JSON.stringify({ questions }),
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

// Function to generate mock questions based on chapter
function generateMockQuestions(chapter: string) {
  const questions = [];
  const numQuestions = 5;
  
  // Based on chapter type, generate appropriate questions
  if (chapter === "Algebra Basics") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `Solve for x: ${Math.floor(Math.random() * 10) + 1}x + ${Math.floor(Math.random() * 10)} = ${Math.floor(Math.random() * 20) + 10}`,
        options: [
          { id: "A", text: `x = ${Math.floor(Math.random() * 10)}` },
          { id: "B", text: `x = ${Math.floor(Math.random() * 10) + 10}` },
          { id: "C", text: `x = ${Math.floor(Math.random() * 10) - 5}` },
          { id: "D", text: `x = ${Math.floor(Math.random() * 10) + 5}` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Algebra",
        chapter: "Algebra Basics",
        explanation: "To solve this equation, isolate the variable x by first subtracting the constant from both sides, then dividing both sides by the coefficient of x."
      });
    }
  } else if (chapter === "Equations") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `Solve the quadratic equation: x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)} = 0`,
        options: [
          { id: "A", text: `x = 2, x = -3` },
          { id: "B", text: `x = 1, x = -4` },
          { id: "C", text: `x = 0, x = -5` },
          { id: "D", text: `x = 3, x = -2` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Algebra",
        chapter: "Equations",
        explanation: "To solve a quadratic equation, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a, where ax² + bx + c = 0"
      });
    }
  } else if (chapter === "Circles") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `Find the area of a circle with radius ${Math.floor(Math.random() * 10) + 1} units.`,
        options: [
          { id: "A", text: `${Math.floor(Math.random() * 100) + 50}π square units` },
          { id: "B", text: `${Math.floor(Math.random() * 100) + 50}π square units` },
          { id: "C", text: `${Math.floor(Math.random() * 100) + 50}π square units` },
          { id: "D", text: `${Math.floor(Math.random() * 100) + 50}π square units` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Geometry",
        chapter: "Circles",
        explanation: "The area of a circle is calculated using the formula A = πr², where r is the radius of the circle."
      });
    }
  } else if (chapter === "Triangles") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `What is the area of a triangle with base ${Math.floor(Math.random() * 10) + 5} units and height ${Math.floor(Math.random() * 10) + 5} units?`,
        options: [
          { id: "A", text: `${Math.floor(Math.random() * 100) + 20} square units` },
          { id: "B", text: `${Math.floor(Math.random() * 100) + 20} square units` },
          { id: "C", text: `${Math.floor(Math.random() * 100) + 20} square units` },
          { id: "D", text: `${Math.floor(Math.random() * 100) + 20} square units` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Geometry",
        chapter: "Triangles",
        explanation: "The area of a triangle is calculated using the formula A = (1/2) × base × height."
      });
    }
  } else if (chapter === "Polynomials") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `Simplify: (${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)}) + (${Math.floor(Math.random() * 5) + 1}x² + ${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)})`,
        options: [
          { id: "A", text: `${Math.floor(Math.random() * 10) + 2}x² + ${Math.floor(Math.random() * 20)}x + ${Math.floor(Math.random() * 20)}` },
          { id: "B", text: `${Math.floor(Math.random() * 10) + 2}x² + ${Math.floor(Math.random() * 20)}x + ${Math.floor(Math.random() * 20)}` },
          { id: "C", text: `${Math.floor(Math.random() * 10) + 2}x² + ${Math.floor(Math.random() * 20)}x + ${Math.floor(Math.random() * 20)}` },
          { id: "D", text: `${Math.floor(Math.random() * 10) + 2}x² + ${Math.floor(Math.random() * 20)}x + ${Math.floor(Math.random() * 20)}` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Algebra",
        chapter: "Polynomials",
        explanation: "To add polynomials, combine like terms by adding coefficients of terms with the same variable and exponent."
      });
    }
  } else if (chapter === "Trigonometry") {
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `If sin(θ) = ${(Math.random() * 0.9 + 0.1).toFixed(2)}, what is cos(θ)?`,
        options: [
          { id: "A", text: `${(Math.random() * 0.9 + 0.1).toFixed(2)}` },
          { id: "B", text: `${(Math.random() * 0.9 + 0.1).toFixed(2)}` },
          { id: "C", text: `${(Math.random() * 0.9 + 0.1).toFixed(2)}` },
          { id: "D", text: `${(Math.random() * 0.9 + 0.1).toFixed(2)}` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "Trigonometry",
        chapter: "Trigonometry",
        explanation: "Using the Pythagorean identity sin²(θ) + cos²(θ) = 1, we can find cos(θ) by rearranging to get cos(θ) = √(1 - sin²(θ))."
      });
    }
  } else {
    // Default: generate generic math questions
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        question: `What is ${Math.floor(Math.random() * 100) + 1} + ${Math.floor(Math.random() * 100) + 1}?`,
        options: [
          { id: "A", text: `${Math.floor(Math.random() * 200) + 1}` },
          { id: "B", text: `${Math.floor(Math.random() * 200) + 1}` },
          { id: "C", text: `${Math.floor(Math.random() * 200) + 1}` },
          { id: "D", text: `${Math.floor(Math.random() * 200) + 1}` }
        ],
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        subject: "General Math",
        chapter: chapter,
        explanation: "To add numbers, combine their values."
      });
    }
  }
  
  return questions;
}
