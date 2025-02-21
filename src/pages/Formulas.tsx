import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
const Formulas = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("algebra");
  const formulas = {
    algebra: [{
      name: "Quadratic Formula",
      formula: "x = (-b ± √(b² - 4ac)) / 2a",
      explanation: "Used to solve quadratic equations in the form ax² + bx + c = 0",
      example: "For x² + 5x + 6 = 0:\na = 1, b = 5, c = 6\nx = (-5 ± √(25 - 24)) / 2\nx = -2 or -3"
    }, {
      name: "FOIL Method",
      formula: "(a + b)(c + d) = ac + ad + bc + bd",
      explanation: "Used to multiply two binomials: First, Outer, Inner, Last",
      example: "(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6"
    }, {
      name: "Difference of Squares",
      formula: "a² - b² = (a + b)(a - b)",
      explanation: "Used to factor the difference of perfect squares",
      example: "x² - 16 = (x + 4)(x - 4)"
    }, {
      name: "Sum of Cubes",
      formula: "a³ + b³ = (a + b)(a² - ab + b²)",
      explanation: "Used to factor the sum of cubes",
      example: "x³ + 8 = (x + 2)(x² - 2x + 4)"
    }, {
      name: "Difference of Cubes",
      formula: "a³ - b³ = (a - b)(a² + ab + b²)",
      explanation: "Used to factor the difference of cubes",
      example: "x³ - 8 = (x - 2)(x² + 2x + 4)"
    }, {
      name: "Perfect Square Trinomial",
      formula: "a² + 2ab + b² = (a + b)²",
      explanation: "Used to factor perfect square trinomials",
      example: "x² + 6x + 9 = (x + 3)²"
    }],
    trigonometry: [{
      name: "Sine Law",
      formula: "a/sin A = b/sin B = c/sin C",
      explanation: "Relates sides to angles in any triangle",
      example: "In triangle ABC with side a = 5 and angle A = 30°, B = 45°:\nb = 5 × sin(45°)/sin(30°)"
    }, {
      name: "Cosine Law",
      formula: "c² = a² + b² - 2ab cos(C)",
      explanation: "Relates three sides and one angle of a triangle",
      example: "In triangle with a = 3, b = 4, C = 60°:\nc² = 3² + 4² - 2(3)(4)cos(60°)"
    }, {
      name: "Unit Circle Values",
      formula: "sin(30°) = 1/2, cos(30°) = √3/2",
      explanation: "Common angle values in the unit circle",
      example: "At 30°: sin = 0.5, cos ≈ 0.866"
    }, {
      name: "Double Angle Formulas",
      formula: "sin(2θ) = 2sin(θ)cos(θ)\ncos(2θ) = cos²(θ) - sin²(θ)",
      explanation: "Used to find trig values of double angles",
      example: "sin(60°) = 2sin(30°)cos(30°) = 2(0.5)(0.866) = 0.866"
    }, {
      name: "Half Angle Formulas",
      formula: "sin²(θ/2) = (1 - cos(θ))/2\ncos²(θ/2) = (1 + cos(θ))/2",
      explanation: "Used to find trig values of half angles",
      example: "sin²(45°) = (1 - cos(90°))/2 = 0.5"
    }, {
      name: "Sum and Difference Formulas",
      formula: "sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)",
      explanation: "Used to find trig values of sum or difference of angles",
      example: "sin(75°) = sin(45° + 30°) = sin(45°)cos(30°) + cos(45°)sin(30°)"
    }],
    polynomial: [{
      name: "Polynomial Long Division",
      formula: "Dividend ÷ Divisor = Quotient + Remainder/Divisor",
      explanation: "Used to divide polynomials by factoring step by step",
      example: "(x³ + 2x² - 4) ÷ (x + 2) = x² - 2x + 6"
    }, {
      name: "Synthetic Division",
      formula: "Quick method for dividing by (x - r)",
      explanation: "Used when dividing by a linear factor x - r",
      example: "x³ - 6x² + 11x - 6 divided by x - 1"
    }, {
      name: "Factor Theorem",
      formula: "P(a) = 0 ⟺ (x - a) is a factor",
      explanation: "If P(a) = 0, then a is a root of P(x)",
      example: "If P(2) = 0, then (x - 2) is a factor of P(x)"
    }, {
      name: "Remainder Theorem",
      formula: "If P(x) ÷ (x - a) = Q(x) + R, then R = P(a)",
      explanation: "The remainder when dividing by (x - a) equals P(a)",
      example: "For P(x) = x³ - 6x² + 11x - 6, P(1) gives remainder when divided by (x - 1)"
    }, {
      name: "Rational Root Theorem",
      formula: "Possible rational roots = ±(factors of constant term)/(factors of leading coefficient)",
      explanation: "Used to find potential rational roots of a polynomial",
      example: "For x³ - 6x² + 11x - 6, possible roots are factors of 6: ±1, ±2, ±3, ±6"
    }],
    geometry: [{
      name: "Rectangle",
      formula: "Area = length × width\nPerimeter = 2(length + width)",
      explanation: "Basic formulas for rectangular shapes",
      example: "For a rectangle with length 5 and width 3:\nArea = 5 × 3 = 15\nPerimeter = 2(5 + 3) = 16"
    }, {
      name: "Circle",
      formula: "Area = πr²\nCircumference = 2πr",
      explanation: "r is the radius of the circle",
      example: "For a circle with radius 4:\nArea = π(4²) = 50.27\nCircumference = 2π(4) = 25.13"
    }, {
      name: "Triangle",
      formula: "Area = ½ × base × height\nPerimeter = a + b + c",
      explanation: "a, b, c are the sides of the triangle",
      example: "For a triangle with base 6 and height 4:\nArea = ½ × 6 × 4 = 12"
    }, {
      name: "Regular Polygon",
      formula: "Area = (n × s × h)/2\nPerimeter = n × s",
      explanation: "n = number of sides, s = side length, h = apothem",
      example: "For a regular hexagon with side 4 and apothem 3.46:\nArea = (6 × 4 × 3.46)/2 = 41.52"
    }, {
      name: "Sphere",
      formula: "Surface Area = 4πr²\nVolume = (4/3)πr³",
      explanation: "r is the radius of the sphere",
      example: "For a sphere with radius 3:\nSurface Area = 4π(3²) = 113.1\nVolume = (4/3)π(3³) = 113.1"
    }, {
      name: "Cylinder",
      formula: "Surface Area = 2πr² + 2πrh\nVolume = πr²h",
      explanation: "r is radius, h is height",
      example: "For a cylinder with radius 2 and height 5:\nVolume = π(2²)(5) = 62.8"
    }],
    calculus: [{
      name: "Power Rule",
      formula: "d/dx(x^n) = nx^(n-1)",
      explanation: "Used to find the derivative of power functions",
      example: "d/dx(x³) = 3x²"
    }, {
      name: "Chain Rule",
      formula: "d/dx[f(g(x))] = f'(g(x)) × g'(x)",
      explanation: "Used to find the derivative of composite functions",
      example: "d/dx(sin(x²)) = 2x × cos(x²)"
    }, {
      name: "Integration by Parts",
      formula: "∫u dv = uv - ∫v du",
      explanation: "Used to integrate products of functions",
      example: "∫x sin(x) dx = -x cos(x) + ∫cos(x) dx"
    }, {
      name: "Partial Fractions",
      formula: "∫[P(x)/Q(x)]dx where deg(P) < deg(Q)",
      explanation: "Used to integrate rational functions",
      example: "∫[1/(x²-1)]dx = ½ln|x-1| - ½ln|x+1| + C"
    }, {
      name: "L'Hôpital's Rule",
      formula: "lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x)",
      explanation: "Used when limit gives 0/0 or ∞/∞",
      example: "lim(x→0) sin(x)/x = lim(x→0) cos(x)/1 = 1"
    }]
  };
  return <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-tutor-text mb-8 text-center">Mathematical Formulas</h1>
        
        {Object.entries(formulas).map(([category, formulas]) => <Card key={category} className="glass-card mb-6 animate-fade-up hover-lift">
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between" onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}>
              <CardTitle className="capitalize">{category}</CardTitle>
              {expandedCategory === category ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </CardHeader>
            {expandedCategory === category && <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {formulas.map((formula, index) => <div key={index} className="p-4 rounded-lg transition-all bg-stone-950 hover:bg-stone-800">
                      <h3 className="font-medium text-tutor-primary mb-2">{formula.name}</h3>
                      <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded mb-2">{formula.formula}</p>
                      <p className="text-gray-600 mb-2">{formula.explanation}</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Example:</p>
                        <p className="whitespace-pre-wrap font-mono text-sm text-[#444545]">{formula.example}</p>
                      </div>
                    </div>)}
                </div>
              </CardContent>}
          </Card>)}
      </div>
    </div>;
};
export default Formulas;