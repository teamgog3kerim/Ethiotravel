import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { PaymentSection } from "@/components/PaymentSection";

export function Booking() {
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingAmount, setBookingAmount] = useState(500);

  const handleBookingCreated = (bookingId: string, amount?: number) => {
    setCurrentBookingId(bookingId);
    if (amount) {
      setBookingAmount(amount);
    }
    setShowPayment(true);
    // Scroll to payment section
    setTimeout(() => {
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent">
      <BookingForm onBookingCreated={handleBookingCreated} />
      
      {showPayment && (
        <div id="payment-section">
          <PaymentSection 
            bookingId={currentBookingId || undefined} 
            amount={bookingAmount}
          />
        </div>
      )}
    </div>
  );
}
