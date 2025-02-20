
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Formulas = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("algebra");

  const formulas = {
    algebra: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b² - 4ac)) / 2a", explanation: "Used to solve quadratic equations in the form ax² + bx + c = 0", example: "For x² + 5x + 6 = 0:\na = 1, b = 5, c = 6\nx = (-5 ± √(25 - 24)) / 2\nx = -2 or -3" },
      { name: "FOIL Method", formula: "(a + b)(c + d) = ac + ad + bc + bd", explanation: "Used to multiply two binomials: First, Outer, Inner, Last", example: "(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6" },
      { name: "Difference of Squares", formula: "a² - b² = (a + b)(a - b)", explanation: "Used to factor the difference of perfect squares", example: "x² - 16 = (x + 4)(x - 4)" },
    ],
    trigonometry: [
      { name: "Sine Law", formula: "a/sin A = b/sin B = c/sin C", explanation: "Relates sides to angles in any triangle", example: "In triangle ABC with side a = 5 and angle A = 30°, B = 45°:\nb = 5 × sin(45°)/sin(30°)" },
      { name: "Cosine Law", formula: "c² = a² + b² - 2ab cos(C)", explanation: "Relates three sides and one angle of a triangle", example: "In triangle with a = 3, b = 4, C = 60°:\nc² = 3² + 4² - 2(3)(4)cos(60°)" },
      { name: "Unit Circle Values", formula: "sin(30°) = 1/2, cos(30°) = √3/2", explanation: "Common angle values in the unit circle", example: "At 30°: sin = 0.5, cos ≈ 0.866" },
    ],
    polynomial: [
      { name: "Polynomial Long Division", formula: "Dividend ÷ Divisor = Quotient + Remainder/Divisor", explanation: "Used to divide polynomials by factoring step by step", example: "(x³ + 2x² - 4) ÷ (x + 2) = x² - 2x + 6" },
      { name: "Synthetic Division", formula: "Quick method for dividing by (x - r)", explanation: "Used when dividing by a linear factor x - r", example: "x³ - 6x² + 11x - 6 divided by x - 1" },
      { name: "Factor Theorem", formula: "P(a) = 0 ⟺ (x - a) is a factor", explanation: "If P(a) = 0, then a is a root of P(x)", example: "If P(2) = 0, then (x - 2) is a factor of P(x)" },
    ],
    geometry: [
      { name: "Rectangle", formula: "Area = length × width\nPerimeter = 2(length + width)", explanation: "Basic formulas for rectangular shapes", example: "For a rectangle with length 5 and width 3:\nArea = 5 × 3 = 15\nPerimeter = 2(5 + 3) = 16" },
      { name: "Circle", formula: "Area = πr²\nCircumference = 2πr", explanation: "r is the radius of the circle", example: "For a circle with radius 4:\nArea = π(4²) = 50.27\nCircumference = 2π(4) = 25.13" },
      { name: "Triangle", formula: "Area = ½ × base × height\nPerimeter = a + b + c", explanation: "a, b, c are the sides of the triangle", example: "For a triangle with base 6 and height 4:\nArea = ½ × 6 × 4 = 12" },
    ],
    calculus: [
      { name: "Power Rule", formula: "d/dx(x^n) = nx^(n-1)", explanation: "Used to find the derivative of power functions", example: "d/dx(x³) = 3x²" },
      { name: "Chain Rule", formula: "d/dx[f(g(x))] = f'(g(x)) × g'(x)", explanation: "Used to find the derivative of composite functions", example: "d/dx(sin(x²)) = 2x × cos(x²)" },
      { name: "Integration by Parts", formula: "∫u dv = uv - ∫v du", explanation: "Used to integrate products of functions", example: "∫x sin(x) dx = -x cos(x) + ∫cos(x) dx" },
    ],
  };

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-tutor-text mb-8 text-center">Mathematical Formulas</h1>
        
        {Object.entries(formulas).map(([category, formulas]) => (
          <Card key={category} className="glass-card mb-6 animate-fade-up hover-lift">
            <CardHeader 
              className="cursor-pointer flex flex-row items-center justify-between"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <CardTitle className="capitalize">{category}</CardTitle>
              {expandedCategory === category ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </CardHeader>
            {expandedCategory === category && (
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {formulas.map((formula, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-all"
                    >
                      <h3 className="font-medium text-tutor-primary mb-2">{formula.name}</h3>
                      <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded mb-2">{formula.formula}</p>
                      <p className="text-gray-600 mb-2">{formula.explanation}</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Example:</p>
                        <p className="whitespace-pre-wrap font-mono text-sm">{formula.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Formulas;
