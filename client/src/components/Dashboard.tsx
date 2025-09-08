import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Download,
  Mail,
  MapPin,
  DollarSign
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  activeTourists: number;
  totalRevenue: number;
  thisMonthBookings: number;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  numberOfPersons: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

export function Dashboard() {
  const { t } = useTranslation();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const handleExportPDF = () => {
    window.open('/api/bookings/export/pdf', '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-accent/20 text-accent" data-testid="badge-confirmed">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-secondary/20 text-secondary" data-testid="badge-pending">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-destructive/20 text-destructive" data-testid="badge-failed">Failed</Badge>;
      default:
        return <Badge variant="outline" data-testid="badge-default">{status}</Badge>;
    }
  };

  const formatDateRange = (arrival: string, departure: string) => {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    const arrivalMonth = arrivalDate.toLocaleDateString('en', { month: 'short' });
    const departureMonth = departureDate.toLocaleDateString('en', { month: 'short' });
    
    if (arrivalMonth === departureMonth) {
      return `${arrivalMonth} ${arrivalDate.getDate()}-${departureDate.getDate()}`;
    } else {
      return `${arrivalMonth} ${arrivalDate.getDate()} - ${departureMonth} ${departureDate.getDate()}`;
    }
  };

  if (statsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-dashboardTitle">
            {t('dashboard.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {t('dashboard.totalBookings')}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-totalBookings">
                    {stats?.totalBookings || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {t('dashboard.activeTourists')}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-activeTourists">
                    {stats?.activeTourists || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Users className="text-accent text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {t('dashboard.revenue')}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-revenue">
                    ${stats?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-secondary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {t('dashboard.thisMonth')}
                  </p>
                  <p className="text-3xl font-bold text-foreground" data-testid="stat-thisMonth">
                    {stats?.thisMonthBookings || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t('dashboard.recentBookings')}
                  </h3>
                  <div className="flex space-x-2">
                    <Button size="sm" data-testid="button-viewAll">
                      {t('dashboard.viewAll')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportPDF}
                      data-testid="button-exportPdf"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      {t('dashboard.exportPdf')}
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-muted-foreground font-medium">
                          {t('dashboard.customer')}
                        </th>
                        <th className="text-left py-3 text-muted-foreground font-medium">
                          {t('dashboard.dates')}
                        </th>
                        <th className="text-left py-3 text-muted-foreground font-medium">
                          {t('dashboard.travelers')}
                        </th>
                        <th className="text-left py-3 text-muted-foreground font-medium">
                          {t('dashboard.amount')}
                        </th>
                        <th className="text-left py-3 text-muted-foreground font-medium">
                          {t('dashboard.status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="border-b border-border" data-testid={`row-booking-${booking.id}`}>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-foreground">{booking.fullName}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {booking.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 text-foreground">
                            {formatDateRange(booking.arrivalDate, booking.departureDate)}
                          </td>
                          <td className="py-4 text-foreground">{booking.numberOfPersons}</td>
                          <td className="py-4 text-foreground font-semibold">
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {booking.totalAmount}
                            </span>
                          </td>
                          <td className="py-4">
                            {getStatusBadge(booking.paymentStatus)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {bookings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground" data-testid="text-noBookings">
                        No bookings found
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Calendar View */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  {t('dashboard.calendarView')}
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground">
                      {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Simple calendar grid - in a real implementation, you'd calculate actual dates */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 5; // Start from a Sunday
                      const isCurrentMonth = day > 0 && day <= 31;
                      const isToday = day === new Date().getDate();
                      const hasBooking = isCurrentMonth && Math.random() > 0.8; // Mock booking indicator
                      
                      return (
                        <div 
                          key={i} 
                          className={`p-2 ${
                            !isCurrentMonth 
                              ? 'text-muted-foreground/50' 
                              : isToday 
                                ? 'bg-primary text-primary-foreground rounded font-medium'
                                : hasBooking 
                                  ? 'bg-accent/20 text-accent rounded font-medium'
                                  : 'text-muted-foreground'
                          }`}
                        >
                          {isCurrentMonth ? day : ''}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent/20 rounded"></div>
                      <span className="text-muted-foreground">Active bookings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-secondary/20 rounded"></div>
                      <span className="text-muted-foreground">Pending confirmations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
