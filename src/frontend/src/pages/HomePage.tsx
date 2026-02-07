import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGetSiteBranding } from '../hooks/useBranding';
import { ArrowRight, Code, Server, Wrench, Package } from 'lucide-react';
import BrandingCarousel from '../components/branding/BrandingCarousel';

export default function HomePage() {
    const { data: branding } = useGetSiteBranding();

    const hasSliderImages = branding?.homepageSliderImages && branding.homepageSliderImages.length > 0;
    const hasBannerFallback = branding?.storeBanners && branding.storeBanners.length > 0;

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-background via-muted/20 to-background py-20">
                {!hasSliderImages && hasBannerFallback && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: `url(${branding.storeBanners[0]})` }}
                    />
                )}
                <div className="container relative mx-auto px-4">
                    {hasSliderImages && (
                        <div className="mb-12">
                            <BrandingCarousel images={branding.homepageSliderImages} />
                        </div>
                    )}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Professional IT Solutions
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            From custom WordPress websites to computer servicing and quality hardware, we provide
                            comprehensive IT services and products for your business needs.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/services">
                                <Button size="lg" className="gap-2">
                                    Explore Services <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/store">
                                <Button size="lg" variant="outline" className="gap-2">
                                    Browse Store <Package className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold text-foreground">What We Offer</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader>
                                <Code className="mb-2 h-8 w-8 text-amber-600" />
                                <CardTitle>Website Development</CardTitle>
                                <CardDescription>Custom WordPress websites tailored to your needs</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Server className="mb-2 h-8 w-8 text-amber-600" />
                                <CardTitle>Hosting & Domains</CardTitle>
                                <CardDescription>Reliable hosting solutions and domain registration</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Wrench className="mb-2 h-8 w-8 text-amber-600" />
                                <CardTitle>Computer Servicing</CardTitle>
                                <CardDescription>Expert repair and maintenance services</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Package className="mb-2 h-8 w-8 text-amber-600" />
                                <CardTitle>Hardware & Parts</CardTitle>
                                <CardDescription>Quality computer components and accessories</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Whether you need a new website, reliable hosting, or quality computer parts, we're here to help.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link to="/services">
                            <Button size="lg">View Our Services</Button>
                        </Link>
                        <Link to="/store">
                            <Button size="lg" variant="outline">
                                Shop Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
