import RequireAuth from '../components/auth/RequireAuth';
import { useCartStore } from '../state/cart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import StartCheckoutButton from '../components/checkout/StartCheckoutButton';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function CheckoutPage() {
    const { items, getTotal } = useCartStore();

    return (
        <RequireAuth>
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <h1 className="mb-8 text-4xl font-bold text-foreground">Checkout</h1>

                {items.length === 0 ? (
                    <div className="text-center">
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Link to="/store">
                            <Button className="mt-4">Browse Store</Button>
                        </Link>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={Number(item.product.id)} className="flex justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-amber-600">
                                            ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-amber-600">${getTotal().toFixed(2)}</span>
                            </div>
                            <StartCheckoutButton />
                        </CardContent>
                    </Card>
                )}
            </div>
        </RequireAuth>
    );
}
