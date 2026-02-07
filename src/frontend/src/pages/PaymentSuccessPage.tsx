import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '../state/cart';

export default function PaymentSuccessPage() {
    const { clearCart } = useCartStore();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="container mx-auto max-w-2xl px-4 py-16">
            <Card>
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
                    <CardTitle className="mt-4 text-3xl">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link to="/account">
                            <Button>View Orders</Button>
                        </Link>
                        <Link to="/store">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
