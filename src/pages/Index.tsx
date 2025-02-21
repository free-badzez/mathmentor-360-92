const Index = () => {
  return <div className="min-h-screen bg-gradient-to-b from-tutor-background to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-tutor-text mb-6 animate-fade-up tracking-tight">
          Welcome to MathMentor
        </h1>
        <p className="text-xl text-gray-600 mb-12 animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{
        animationDelay: "0.1s"
      }}>
          Your personal AI-powered mathematics tutor, designed to adapt and grow with your learning journey
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div style={{
          animationDelay: "0.2s"
        }} className="glass-card p-8 rounded-2xl animate-slide-up hover-lift bg-neutral-900 hover:bg-neutral-800">
            <div className="h-12 w-12 bg-gradient-to-br from-tutor-primary to-tutor-secondary rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-tutor-primary">Practice Questions</h2>
            <p className="text-gray-600 leading-relaxed">
              Access a wide range of math problems tailored to your level, with instant feedback and detailed solutions
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl animate-slide-up hover-lift" style={{
          animationDelay: "0.3s"
        }}>
            <div className="h-12 w-12 bg-gradient-to-br from-tutor-secondary to-tutor-accent rounded-xl mb-6 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-tutor-secondary">AI Assistance</h2>
            <p className="text-gray-600 leading-relaxed">
              Get step-by-step explanations and personalized help from our advanced AI tutor
            </p>
          </div>
        </div>

        <div className="mt-16 glass-card p-8 rounded-2xl animate-slide-up" style={{
        animationDelay: "0.4s"
      }}>
          <h3 className="text-xl font-semibold mb-4 text-tutor-text">
            Ready to start learning?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of students who are mastering mathematics with personalized AI assistance
          </p>
          <button className="bg-gradient-to-r from-tutor-primary to-tutor-secondary text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg premium-transition">
            Get Started
          </button>
        </div>
      </div>
    </div>;
};
export default Index;