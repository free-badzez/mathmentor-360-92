
import { Link } from "react-router-dom";
import { Calculator, GraduationCap, Home, BookOpen, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-4 text-tutor-text hover:text-tutor-primary premium-transition"
            >
              <GraduationCap className="h-6 w-6 mr-2" />
              <span className="font-semibold text-lg">MathMentor</span>
            </Link>
          </div>
          
          <div className="flex space-x-2">
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
            <NavLink to="/practice" icon={<Calculator className="h-5 w-5" />} text="Practice" />
            <NavLink to="/ai-tutor" icon={<BookOpen className="h-5 w-5" />} text="AI Tutor" />
            <NavLink to="/profile" icon={<User className="h-5 w-5" />} text="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-tutor-primary hover:bg-gray-50/80 premium-transition"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
);

export default Navbar;
