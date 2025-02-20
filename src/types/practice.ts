
export interface Option {
  id: string;
  text: string;
}

export interface Problem {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  difficulty: string;
  subject: string;
  explanation: string;
}
