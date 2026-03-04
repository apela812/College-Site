import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useI18n, type Language } from "@/lib/i18n";
import { useTheme } from "@/components/theme-provider";
import { Cross, Menu, Moon, Sun, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { lang, setLang, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/about", label: t('nav.about') },
    { href: "/applicants", label: t('nav.applicants') },
    { href: "/students", label: t('nav.students') },
    { href: "/news", label: t('nav.news') },
    { href: "/schedule", label: "Расписание" },
    { href: "/announcements", label: "Объявления" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Cross size={24} strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg leading-tight text-foreground uppercase tracking-wider">
                ГАПОУ "Альметьевский медицинский колледж"
              </h1>
              <p className="text-xs text-muted-foreground font-medium">{t('nav.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-accent/30 p-1 rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                  location === link.href 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            
            {/* Lang Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover-elevate">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Switch Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setLang('ru')} className={lang === 'ru' ? 'bg-accent font-bold' : ''}>Русский</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('en')} className={lang === 'en' ? 'bg-accent font-bold' : ''}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('tt')} className={lang === 'tt' ? 'bg-accent font-bold' : ''}>Татарча</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover-elevate"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t('theme.toggle')}</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-full"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col p-6"
          >
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-display font-semibold py-4 border-b border-border/50 ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
