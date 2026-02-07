import { useParams, Link } from '@tanstack/react-router';
import { useGetProducts } from '../hooks/useProducts';
import { useGetSiteBranding } from '../hooks/useBranding';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../state/cart';
import { toast } from 'sonner';
import BrandingBanner from '../components/branding/BrandingBanner';

export default function ProductDetailPage() {
    const { productId } = useParams({ from: '/store/$productId' });
    const { data: products, isLoading } = useGetProducts();
    const { data: branding } = useGetSiteBranding();
    const { addItem } = useCartStore();
    const product = products?.find((p) => Number(p.id) === Number(productId));

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            toast.success(`${product.name} added to cart`);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Skeleton className="mb-4 h-8 w-32" />
                <Skeleton className="mb-8 h-12 w-3/4" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
                <Link to="/store">
                    <Button className="mt-4">Back to Store</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {branding?.storeBanners && branding.storeBanners.length > 0 && (
                <div className="mb-8">
                    <BrandingBanner images={branding.storeBanners} />
                </div>
            )}

            <Link to="/store">
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Store
                </Button>
            </Link>

            <div className="grid gap-8 lg:grid-cols-2">
                {product.imageUrl ? (
                    <div className="overflow-hidden rounded-lg">
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="aspect-square w-full rounded-lg bg-muted" />
                )}
                <div>
                    <div className="flex items-start justify-between">
                        <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
                        <Badge variant="secondary" className="text-base">
                            {product.category}
                        </Badge>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-amber-600">${Number(product.price)}</p>
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </div>
                    <div className="mt-8 space-y-4">
                        <Button onClick={handleAddToCart} size="lg" className="w-full gap-2">
                            <ShoppingCart className="h-5 w-5" /> Add to Cart
                        </Button>
                        <Link to="/cart">
                            <Button variant="outline" size="lg" className="w-full">
                                View Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
