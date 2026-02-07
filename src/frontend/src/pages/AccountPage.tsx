import RequireAuth from '../components/auth/RequireAuth';
import { useGetCallerOrders } from '../hooks/useOrders';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { User, Package } from 'lucide-react';

export default function AccountPage() {
    const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
    const { data: orders, isLoading: ordersLoading } = useGetCallerOrders();

    return (
        <RequireAuth>
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-8 text-4xl font-bold text-foreground">My Account</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profileLoading ? (
                                    <Skeleton className="h-6 w-32" />
                                ) : (
                                    <p className="text-lg font-medium text-foreground">{userProfile?.name}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ordersLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-full" />
                                        ))}
                                    </div>
                                ) : orders && orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={Number(order.id)}
                                                className="rounded-lg border border-border p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            Order #{Number(order.id)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.orderedProducts.length} item(s)
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge
                                                            variant={
                                                                order.status === 'completed'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                        <p className="mt-1 font-semibold text-amber-600">
                                                            ${Number(order.totalAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 space-y-1">
                                                    {order.orderedProducts.map((product, idx) => (
                                                        <p key={idx} className="text-sm text-muted-foreground">
                                                            • {product.name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No orders yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </RequireAuth>
    );
}
