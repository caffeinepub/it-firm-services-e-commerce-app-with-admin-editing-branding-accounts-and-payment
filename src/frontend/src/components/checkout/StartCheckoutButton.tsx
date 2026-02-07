import { useState } from 'react';
import { useCreateCheckoutSession } from '../../hooks/useStripeCheckout';
import { useCreateOrder } from '../../hooks/useOrders';
import { useCartStore } from '../../state/cart';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingItem } from '../../backend';

export default function StartCheckoutButton() {
    const { items, getTotal } = useCartStore();
    const createCheckoutSession = useCreateCheckoutSession();
    const createOrder = useCreateOrder();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // Create order first
            const products = items.map((item) => item.product);
            const totalAmount = BigInt(Math.round(getTotal()));
            await createOrder.mutateAsync({ products, totalAmount });

            // Create Stripe checkout session
            const shoppingItems: ShoppingItem[] = items.map((item) => ({
                productName: item.product.name,
                productDescription: item.product.description,
                priceInCents: BigInt(Number(item.product.price) * 100),
                quantity: BigInt(item.quantity),
                currency: 'usd'
            }));

            const session = await createCheckoutSession.mutateAsync(shoppingItems);
            
            if (!session?.url) {
                throw new Error('Stripe session missing url');
            }

            // Redirect to Stripe
            window.location.href = session.url;
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to start checkout');
            setIsProcessing(false);
        }
    };

    return (
        <Button onClick={handleCheckout} disabled={isProcessing} size="lg" className="w-full">
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
    );
}
