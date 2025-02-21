
import { Link, useLocation } from "react-router-dom";
import { Calculator, GraduationCap, Home, BookOpen, User, Library, LayoutDashboard, Binary, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/"
              className="flex items-center px-4 text-foreground hover:text-foreground/90 premium-transition"
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
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" isActive={location.pathname === "/"} />
            <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" isActive={location.pathname === "/dashboard"} />
            <NavLink to="/practice" icon={<Calculator className="h-5 w-5" />} text="Practice" isActive={location.pathname === "/practice"} />
            <NavLink to="/ai-tutor" icon={<BookOpen className="h-5 w-5" />} text="AI Tutor" isActive={location.pathname === "/ai-tutor"} />
            <NavLink to="/resources" icon={<Library className="h-5 w-5" />} text="Resources" isActive={location.pathname === "/resources"} />
            <NavLink to="/formulas" icon={<Binary className="h-5 w-5" />} text="Formulas" isActive={location.pathname === "/formulas"} />
            <NavLink to="/profile" icon={<User className="h-5 w-5" />} text="Profile" isActive={location.pathname === "/profile"} />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" icon={<Home className="h-5 w-5" />} text="Home" isActive={location.pathname === "/"} />
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" isActive={location.pathname === "/dashboard"} />
              <MobileNavLink to="/practice" icon={<Calculator className="h-5 w-5" />} text="Practice" isActive={location.pathname === "/practice"} />
              <MobileNavLink to="/ai-tutor" icon={<BookOpen className="h-5 w-5" />} text="AI Tutor" isActive={location.pathname === "/ai-tutor"} />
              <MobileNavLink to="/resources" icon={<Library className="h-5 w-5" />} text="Resources" isActive={location.pathname === "/resources"} />
              <MobileNavLink to="/formulas" icon={<Binary className="h-5 w-5" />} text="Formulas" isActive={location.pathname === "/formulas"} />
              <MobileNavLink to="/profile" icon={<User className="h-5 w-5" />} text="Profile" isActive={location.pathname === "/profile"} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive 
        ? "bg-accent text-accent-foreground" 
        : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
    } premium-transition group`}
  >
    {icon}
    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{text}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive 
        ? "bg-accent text-accent-foreground" 
        : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
    } premium-transition`}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </Link>
);

export default Navbar;
