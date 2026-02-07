import { Link } from '@tanstack/react-router';
import { useGetServices } from '../hooks/useServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
    const { data: services, isLoading } = useGetServices();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground">Our Services</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Professional IT solutions tailored to your business needs
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : services && services.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={Number(service.id)} className="flex flex-col">
                            {service.imageUrl && (
                                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                                    <img
                                        src={service.imageUrl}
                                        alt={service.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>{service.title}</CardTitle>
                                    <Badge variant="secondary">{service.category}</Badge>
                                </div>
                                {service.pricing && (
                                    <CardDescription className="text-lg font-semibold text-amber-600">
                                        ${Number(service.pricing)}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3">{service.description}</p>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Link
                                    to="/services/$serviceId"
                                    params={{ serviceId: service.id.toString() }}
                                >
                                    <Button variant="outline" className="w-full gap-2">
                                        Learn More <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">No services available at the moment.</p>
                </div>
            )}
        </div>
    );
}
