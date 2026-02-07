import { Link } from '@tanstack/react-router';
import { useCartStore } from '../state/cart';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="mt-4 text-2xl font-bold text-foreground">Your cart is empty</h1>
                <p className="mt-2 text-muted-foreground">Add some products to get started</p>
                <Link to="/store">
                    <Button className="mt-6">Browse Store</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={Number(item.product.id)}>
                            <CardContent className="flex gap-4 p-6">
                                {item.product.imageUrl ? (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="h-24 w-24 rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded bg-muted" />
                                )}
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                        <p className="mt-1 font-semibold text-amber-600">
                                            ${Number(item.product.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(Number(item.product.id), item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(Number(item.product.id), item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(Number(item.product.id))}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={Number(item.product.id)} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.product.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium">
                                            ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-amber-600">${getTotal().toFixed(2)}</span>
                            </div>
                            <Link to="/checkout">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
