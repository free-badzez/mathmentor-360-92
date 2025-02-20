
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
  chapter: string;
  explanation: string;
}

export interface Chapter {
  id: string;
  name: string;
  subject: string;
}
