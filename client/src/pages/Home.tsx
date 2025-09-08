import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plane, 
  Car, 
  Bed, 
  Map, 
  Utensils, 
  Coffee, 
  Briefcase,
  CloudSun,
  Newspaper,
  PlaneTakeoff,
  Hotel,
  IdCard,
  Star,
  Shield,
  HeadphonesIcon
} from "lucide-react";

export function Home() {
  const { t } = useTranslation();

  // Mock news data - in production this would come from RSS feed
  const newsItems = [
    {
      icon: PlaneTakeoff,
      title: "Ethiopian Airlines Expands Routes", 
      description: "New direct flights to major international destinations now available for tourists.",
      time: "2 hours ago",
      color: "accent"
    },
    {
      icon: Hotel,
      title: "New Luxury Hotels Opening",
      description: "Premium accommodations now available in Addis Ababa city center.",
      time: "5 hours ago", 
      color: "secondary"
    },
    {
      icon: IdCard,
      title: "Visa Processing Updates",
      description: "Faster visa processing times for tourist applications announced.",
      time: "1 day ago",
      color: "primary"
    }
  ];

  const services = [
    {
      icon: Car,
      title: t('services.airport'),
      description: t('services.airportDesc'),
      image: "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: Bed,
      title: t('services.hotel'),
      description: t('services.hotelDesc'),
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: Map,
      title: t('services.tours'),
      description: t('services.toursDesc'),
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6dee9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: Utensils,
      title: t('services.halal'),
      description: t('services.halalDesc'),
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: Coffee,
      title: t('services.coffee'),
      description: t('services.coffeeDesc'),
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: Briefcase,
      title: t('services.business'),
      description: t('services.businessDesc'),
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-heroTitle">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed" data-testid="text-heroSubtitle">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  data-testid="button-startJourney"
                >
                  <Plane className="mr-2 h-5 w-5" />
                  {t('hero.startJourney')}
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all"
                data-testid="button-viewServices"
              >
                <Star className="mr-2 h-5 w-5" />
                {t('hero.viewServices')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Updates & Weather Widget */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Travel Updates */}
            <div className="lg:col-span-2">
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center" data-testid="text-updatesTitle">
                    <Newspaper className="text-primary mr-3" />
                    {t('updates.title')}
                  </h2>
                  
                  <div className="space-y-4">
                    {newsItems.map((item, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 bg-${item.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <item.icon className={`text-${item.color} h-5 w-5`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                              <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center" data-testid="text-weatherTitle">
                <CloudSun className="mr-2" />
                {t('updates.weather')}
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  <CloudSun className="mx-auto h-16 w-16" />
                </div>
                <div className="text-3xl font-bold" data-testid="text-temperature">24°C</div>
                <div className="text-sm opacity-90" data-testid="text-weather">Sunny</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Humidity</span>
                  <span data-testid="text-humidity">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind</span>
                  <span data-testid="text-wind">12 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibility</span>
                  <span data-testid="text-visibility">10 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-servicesTitle">
              {t('services.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow" data-testid={`card-service-${index}`}>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/booking">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                data-testid="button-bookNow"
              >
                <Shield className="mr-2 h-5 w-5" />
                Book Your VIP Experience
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Ethiopia Like Never Before?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied travelers who chose our VIP services for their Ethiopian adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking">
              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold"
                data-testid="button-bookCTA"
              >
                <Plane className="mr-2 h-5 w-5" />
                Book Your Tour Now
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2 text-white/90">
              <HeadphonesIcon className="h-5 w-5" />
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
