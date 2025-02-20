
const Index = () => {
  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-tutor-text mb-6 animate-fade-up">
          Welcome to MathMentor
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Your personal AI-powered mathematics tutor
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="p-6 rounded-lg bg-white shadow-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-semibold mb-4 text-tutor-primary">Practice Questions</h2>
            <p className="text-gray-600">
              Access a wide range of math problems tailored to your level
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-lg animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-2xl font-semibold mb-4 text-tutor-secondary">AI Assistance</h2>
            <p className="text-gray-600">
              Get step-by-step explanations and personalized help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
