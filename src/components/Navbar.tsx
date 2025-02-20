
import { Link } from "react-router-dom";
import { Calculator, GraduationCap, Home, BookOpen, User, Library, LayoutDashboard, Binary, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-4 text-gray-700 hover:text-gray-900 premium-transition"
            >
              <GraduationCap className="h-6 w-6 mr-2" />
              <span className="font-semibold text-lg">MathMentor</span>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex space-x-2">
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
            <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
            <NavLink to="/practice" icon={<Calculator className="h-5 w-5" />} text="Practice" />
            <NavLink to="/ai-tutor" icon={<BookOpen className="h-5 w-5" />} text="AI Tutor" />
            <NavLink to="/resources" icon={<Library className="h-5 w-5" />} text="Resources" />
            <NavLink to="/formulas" icon={<Binary className="h-5 w-5" />} text="Formulas" />
            <NavLink to="/profile" icon={<User className="h-5 w-5" />} text="Profile" />
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" />
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
              <MobileNavLink to="/practice" icon={<Calculator className="h-5 w-5" />} text="Practice" />
              <MobileNavLink to="/ai-tutor" icon={<BookOpen className="h-5 w-5" />} text="AI Tutor" />
              <MobileNavLink to="/resources" icon={<Library className="h-5 w-5" />} text="Resources" />
              <MobileNavLink to="/formulas" icon={<Binary className="h-5 w-5" />} text="Formulas" />
              <MobileNavLink to="/profile" icon={<User className="h-5 w-5" />} text="Profile" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 premium-transition group"
  >
    {icon}
    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{text}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 premium-transition"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
);

export default Navbar;
