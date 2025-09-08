import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Menu } from "lucide-react";
import "./i18n";

import { Home } from "@/pages/Home";
import { Booking } from "@/pages/Booking";
import DashboardPage from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Kerim VIP Tours</h1>
              <p className="text-xs text-muted-foreground">Premium Travel Services</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <Button variant="ghost" className="font-medium" data-testid="nav-home">
                {t('nav.home')}
              </Button>
            </Link>
            <Link href="/booking">
              <Button variant="ghost" className="font-medium" data-testid="nav-booking">
                {t('nav.booking')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium" data-testid="nav-dashboard">
                {t('nav.dashboard')}
              </Button>
            </Link>
          </nav>
          
          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Plane className="text-secondary-foreground text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Kerim VIP Tours</h3>
                <p className="text-sm text-primary-foreground/80">Premium Travel Services</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/" className="hover:text-primary-foreground transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-primary-foreground transition-colors">
                  {t('nav.booking')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary-foreground transition-colors">
                  {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div>teamgog3@gmail.com</div>
              <div>Addis Ababa, Ethiopia</div>
              <div>USDT TRC20 Payments</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/booking" component={Booking} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
