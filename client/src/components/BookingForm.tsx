import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Upload } from "lucide-react";

type BookingFormData = z.infer<typeof insertBookingSchema> & {
  passportPhoto?: File;
};

const pricing = {
  1: 500,
  2: 600,
  3: 900,
  4: 1200,
  5: 1400,
  6: 1600,
};

interface BookingFormProps {
  onBookingCreated?: (bookingId: string, amount?: number) => void;
}

export function BookingForm({ onBookingCreated }: BookingFormProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(insertBookingSchema.extend({
      fullName: z.string().min(1, "Full name is required"),
      email: z.string().email("Valid email is required"),
      hotelPreference: z.string().min(1, "Hotel preference is required"),
      travelPurpose: z.string().min(1, "Travel purpose is required")
    })),
    defaultValues: {
      fullName: "",
      email: "",
      numberOfPersons: 1,
      hotelPreference: "",
      arrivalDate: "",
      departureDate: "",
      travelPurpose: "",
      specialRequests: "",
      totalAmount: 500,
      paymentStatus: "pending",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'passportPhoto' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      if (selectedFile) {
        formData.append('passportPhoto', selectedFile);
      }
      
      formData.append('language', i18n.language);
      
      const response = await apiRequest('POST', '/api/bookings', formData);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: t('booking.success', 'Booking Created Successfully'),
        description: t('booking.successDesc', 'Your booking confirmation has been sent to your email.'),
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      form.reset();
      setSelectedFile(null);
      setCalculatedPrice(0);
      
      if (onBookingCreated) {
        onBookingCreated(booking.id, calculatedPrice || booking.totalAmount);
      }
    },
    onError: (error: any) => {
      toast({
        title: t('booking.error', 'Booking Failed'),
        description: error.message || t('booking.errorDesc', 'Failed to create booking. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const handlePersonsChange = (value: string) => {
    const persons = parseInt(value);
    const price = pricing[persons as keyof typeof pricing] || 0;
    setCalculatedPrice(price);
    form.setValue('numberOfPersons', persons);
    form.setValue('totalAmount', price);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('booking.fileTooLarge', 'File Too Large'),
          description: t('booking.fileTooLargeDesc', 'Please select a file smaller than 5MB.'),
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = (data: BookingFormData) => {
    // Validate dates
    const arrival = new Date(data.arrivalDate);
    const departure = new Date(data.departureDate);
    const diffTime = Math.abs(departure.getTime() - arrival.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 20) {
      toast({
        title: t('booking.durationError', 'Invalid Duration'),
        description: t('booking.durationErrorDesc', 'Maximum duration is 20 days.'),
        variant: "destructive",
      });
      return;
    }

    if (departure <= arrival) {
      toast({
        title: t('booking.dateError', 'Invalid Dates'),
        description: t('booking.dateErrorDesc', 'Departure date must be after arrival date.'),
        variant: "destructive",
      });
      return;
    }

    createBookingMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">{t('booking.title')}</h2>
        <p className="text-xl text-white/90">{t('booking.subtitle')}</p>
      </div>
      
      <Card className="shadow-2xl">
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                {t('booking.personalInfo')}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">{t('booking.fullName')}</Label>
                  <Input
                    id="fullName"
                    {...form.register('fullName')}
                    placeholder="Enter your full name"
                    data-testid="input-fullName"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">{t('booking.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="your.email@example.com"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="passportPhoto">{t('booking.passportPhoto')}</Label>
                <div className="relative">
                  <Input
                    id="passportPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-passportPhoto"
                  />
                  <Label
                    htmlFor="passportPhoto"
                    className="w-full p-3 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {selectedFile ? selectedFile.name : t('booking.uploadText')}
                    </span>
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Travel Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                {t('booking.travelDetails')}
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>{t('booking.numberOfPersons')}</Label>
                  <Select onValueChange={handlePersonsChange} data-testid="select-numberOfPersons">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person - $500</SelectItem>
                      <SelectItem value="2">2 Persons - $600</SelectItem>
                      <SelectItem value="3">3 Persons - $900</SelectItem>
                      <SelectItem value="4">4 Persons - $1,200</SelectItem>
                      <SelectItem value="5">5 Persons - $1,400</SelectItem>
                      <SelectItem value="6">6 Persons - $1,600</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="arrivalDate">{t('booking.arrivalDate')}</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    {...form.register('arrivalDate')}
                    data-testid="input-arrivalDate"
                  />
                </div>
                
                <div>
                  <Label htmlFor="departureDate">{t('booking.departureDate')}</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    {...form.register('departureDate')}
                    data-testid="input-departureDate"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('booking.hotelPreference')}</Label>
                  <Select onValueChange={(value) => form.setValue('hotelPreference', value)} data-testid="select-hotelPreference">
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-star-luxury">5-Star Luxury</SelectItem>
                      <SelectItem value="4-star-premium">4-Star Premium</SelectItem>
                      <SelectItem value="boutique">Boutique Hotel</SelectItem>
                      <SelectItem value="business">Business Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.hotelPreference && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.hotelPreference.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>{t('booking.travelPurpose')}</Label>
                  <Select onValueChange={(value) => form.setValue('travelPurpose', value)} data-testid="select-travelPurpose">
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourism">Tourism</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="family-visit">Family Visit</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.travelPurpose && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.travelPurpose.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="specialRequests">{t('booking.specialRequests')}</Label>
                <Textarea
                  id="specialRequests"
                  {...form.register('specialRequests')}
                  placeholder="Any special requirements or requests..."
                  rows={3}
                  data-testid="textarea-specialRequests"
                />
              </div>
            </div>
            
            {/* Price Display */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-foreground">
                  {t('booking.totalPrice')}
                </span>
                <span className="text-2xl font-bold text-primary" data-testid="text-totalPrice">
                  ${calculatedPrice} USDT
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t('booking.priceIncludes')}
              </p>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              disabled={createBookingMutation.isPending}
              data-testid="button-submit-booking"
            >
              <Plane className="mr-2 h-4 w-4" />
              {createBookingMutation.isPending 
                ? (i18n.language === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                : t('booking.proceedPayment')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
