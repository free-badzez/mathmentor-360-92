
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Formulas = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("trigonometry");

  const formulas = {
    trigonometry: [
      { name: "Sine", formula: "sin θ = opposite/hypotenuse" },
      { name: "Cosine", formula: "cos θ = adjacent/hypotenuse" },
      { name: "Tangent", formula: "tan θ = opposite/adjacent" },
      { name: "Sine Law", formula: "a/sin A = b/sin B = c/sin C" },
      { name: "Cosine Law", formula: "c² = a² + b² - 2ab cos(C)" },
    ],
    identities: [
      { name: "Pythagorean Identity", formula: "sin²θ + cos²θ = 1" },
      { name: "Double Angle (Sin)", formula: "sin(2θ) = 2sinθ cosθ" },
      { name: "Double Angle (Cos)", formula: "cos(2θ) = cos²θ - sin²θ" },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formulas.map((formula, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-all"
                    >
                      <h3 className="font-medium text-tutor-primary mb-2">{formula.name}</h3>
                      <p className="text-gray-700 font-mono">{formula.formula}</p>
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
