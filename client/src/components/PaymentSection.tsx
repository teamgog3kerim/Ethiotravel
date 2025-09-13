import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, Coins, AlertCircle } from "lucide-react";
import binancePayQR from "@assets/binance-pay-qr.png";

interface PaymentSectionProps {
  bookingId?: string;
  amount?: number;
}

export function PaymentSection({ bookingId, amount = 500 }: PaymentSectionProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const binancePayId = "User-464cd";
  
  const confirmPaymentMutation = useMutation({
    mutationFn: async (data: { transactionId: string }) => {
      if (!bookingId) {
        throw new Error("Booking ID is required");
      }
      
      const response = await apiRequest('PATCH', `/api/bookings/${bookingId}/payment`, {
        transactionId: data.transactionId,
        status: 'confirmed'
      });
      return response.json();
    },
    onSuccess: () => {
      setPaymentConfirmed(true);
      toast({
        title: t('payment.success', 'Payment Confirmed'),
        description: t('payment.successDesc', 'Your payment has been confirmed successfully. You will receive an updated confirmation email.'),
      });
      setTransactionId("");
    },
    onError: (error: any) => {
      toast({
        title: t('payment.error', 'Payment Confirmation Failed'),
        description: error.message || t('payment.errorDesc', 'Failed to confirm payment. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const copyBinanceId = async () => {
    try {
      await navigator.clipboard.writeText(binancePayId);
      setIsCopied(true);
      toast({
        title: t('payment.copied', 'ID Copied'),
        description: t('payment.copiedDesc', 'Binance Pay ID copied to clipboard'),
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: t('payment.copyError', 'Copy Failed'),
        description: t('payment.copyErrorDesc', 'Failed to copy ID'),
        variant: "destructive",
      });
    }
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim()) {
      toast({
        title: t('payment.transactionRequired', 'Transaction ID Required'),
        description: t('payment.transactionRequiredDesc', 'Please enter the transaction ID'),
        variant: "destructive",
      });
      return;
    }

    confirmPaymentMutation.mutate({ transactionId });
  };

  return (
    <section className="py-16 bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t('payment.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('payment.subtitle')}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Coins className="text-secondary mr-2" />
                  {t('payment.details')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payment.method')}</span>
                    <span className="font-semibold text-foreground">Binance Pay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payment.currency')}</span>
                    <span className="font-semibold text-foreground">USDT / Crypto</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('payment.amount')}</span>
                    <span className="font-semibold text-primary text-lg" data-testid="text-paymentAmount">
                      ${amount} USDT
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">{t('payment.binanceId')}</h4>
                <div className="bg-muted p-3 rounded border border-border flex items-center justify-between">
                  <code className="text-sm text-foreground break-all flex-1" data-testid="text-binanceId">
                    {binancePayId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyBinanceId}
                    className="ml-2 text-primary hover:text-primary/80"
                    data-testid="button-copyId"
                  >
                    {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold text-accent mb-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {t('payment.important')}
              </h4>
              <ul className="text-sm text-foreground space-y-1">
                <li>{t('payment.binanceApp')}</li>
                <li>{t('payment.exactAmount')}</li>
                <li>{t('payment.saveTransaction')}</li>
              </ul>
            </div>
          </div>
          
          {/* QR Code and Transaction Confirmation */}
          <div className="text-center space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
              <img 
                src={binancePayQR}
                alt="Binance Pay QR Code"
                className="w-64 h-64 mx-auto"
                data-testid="img-qrCode"
              />
              <p className="text-sm text-muted-foreground mt-4">
                {t('payment.scanBinance')}
              </p>
            </div>
            
            {/* Transaction Confirmation */}
            {paymentConfirmed ? (
              <div className="bg-accent/20 border border-accent rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-accent mb-2">
                  {t('payment.confirmed', 'Payment Confirmed!')}
                </h3>
                <p className="text-muted-foreground">
                  {t('payment.confirmedDesc', 'Your payment has been successfully verified. You will receive an updated booking confirmation via email.')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transactionId">{t('payment.transactionId')}</Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Binance Pay transaction ID after payment"
                    data-testid="input-transactionId"
                  />
                </div>
                
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirmPaymentMutation.isPending || !transactionId.trim()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-semibold transition-all"
                  data-testid="button-confirmPayment"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {confirmPaymentMutation.isPending 
                    ? (t('payment.confirming', 'Confirming...'))
                    : t('payment.confirmPayment')
                  }
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
