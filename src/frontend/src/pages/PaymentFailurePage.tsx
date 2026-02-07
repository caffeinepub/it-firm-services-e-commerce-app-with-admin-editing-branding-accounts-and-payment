import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-16">
            <Card>
                <CardHeader className="text-center">
                    <XCircle className="mx-auto h-16 w-16 text-destructive" />
                    <CardTitle className="mt-4 text-3xl">Payment Cancelled</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Your payment was cancelled. No charges have been made to your account.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link to="/cart">
                            <Button>Return to Cart</Button>
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
