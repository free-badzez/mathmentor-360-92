import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, X } from "lucide-react";
const FloatingCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };
  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operator) {
      const result = calculate(previousValue, current, operator);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    setOperator(op);
    setNewNumber(true);
  };
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return b;
    }
  };
  const handleEquals = () => {
    const current = parseFloat(display);
    if (previousValue !== null && operator) {
      const result = calculate(previousValue, current, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setNewNumber(true);
    }
  };
  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setNewNumber(true);
  };
  const buttons = [["7", "8", "9", "÷"], ["4", "5", "6", "×"], ["1", "2", "3", "-"], ["0", ".", "=", "+"]];
  return <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="rounded-full bg-tutor-primary text-white hover:bg-tutor-secondary bg-zinc-900 hover:bg-zinc-800">
        {isOpen ? <X /> : <Calculator />}
      </Button>

      {isOpen && <Card className="absolute bottom-16 right-0 w-64 p-4 glass-card animate-fade-up shadow-xl">
          <div className="p-2 rounded mb-2 text-right bg-slate-600 hover:bg-slate-500">
            <span className="text-xl">{display}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button className="col-span-4" variant="outline" onClick={handleClear}>
              C
            </Button>
            {buttons.map((row, i) => row.map((btn, j) => <Button key={`${i}-${j}`} variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "outline"} onClick={() => {
          if (btn === "=") {
            handleEquals();
          } else if (["÷", "×", "-", "+"].includes(btn)) {
            handleOperator(btn);
          } else {
            handleNumber(btn);
          }
        }}>
                  {btn}
                </Button>))}
          </div>
        </Card>}
    </div>;
};
export default FloatingCalculator;