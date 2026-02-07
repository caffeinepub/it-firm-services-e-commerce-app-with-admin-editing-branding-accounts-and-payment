import { Link } from '@tanstack/react-router';
import { useGetProducts } from '../hooks/useProducts';
import { useGetSiteBranding } from '../hooks/useBranding';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../state/cart';
import { toast } from 'sonner';
import BrandingBanner from '../components/branding/BrandingBanner';

export default function StorePage() {
    const { data: products, isLoading } = useGetProducts();
    const { data: branding } = useGetSiteBranding();
    const { addItem } = useCartStore();

    const handleAddToCart = (product: any) => {
        addItem(product);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            {branding?.storeBanners && branding.storeBanners.length > 0 && (
                <div className="mb-8">
                    <BrandingBanner images={branding.storeBanners} />
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground">Our Store</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Quality computer parts, accessories, and more
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="aspect-square w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : products && products.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <Card key={Number(product.id)} className="flex flex-col">
                            <Link
                                to="/store/$productId"
                                params={{ productId: product.id.toString() }}
                            >
                                {product.imageUrl ? (
                                    <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square w-full bg-muted" />
                                )}
                            </Link>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <Link
                                        to="/store/$productId"
                                        params={{ productId: product.id.toString() }}
                                    >
                                        <CardTitle className="hover:text-amber-600 transition-colors">
                                            {product.name}
                                        </CardTitle>
                                    </Link>
                                    <Badge variant="secondary">{product.category}</Badge>
                                </div>
                                <CardDescription className="text-xl font-bold text-amber-600">
                                    ${Number(product.price)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button onClick={() => handleAddToCart(product)} className="w-full gap-2">
                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">No products available at the moment.</p>
                </div>
            )}
        </div>
    );
}
