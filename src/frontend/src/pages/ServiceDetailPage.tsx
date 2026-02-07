import { useParams, Link } from '@tanstack/react-router';
import { useGetServices } from '../hooks/useServices';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function ServiceDetailPage() {
    const { serviceId } = useParams({ from: '/services/$serviceId' });
    const { data: services, isLoading } = useGetServices();
    const service = services?.find((s) => Number(s.id) === Number(serviceId));

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Skeleton className="mb-4 h-8 w-32" />
                <Skeleton className="mb-8 h-12 w-3/4" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-foreground">Service Not Found</h1>
                <Link to="/services">
                    <Button className="mt-4">Back to Services</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/services">
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Services
                </Button>
            </Link>

            <div className="grid gap-8 lg:grid-cols-2">
                {service.imageUrl && (
                    <div className="overflow-hidden rounded-lg">
                        <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                    </div>
                )}
                <div className={service.imageUrl ? '' : 'lg:col-span-2'}>
                    <div className="flex items-start justify-between">
                        <h1 className="text-4xl font-bold text-foreground">{service.title}</h1>
                        <Badge variant="secondary" className="text-base">
                            {service.category}
                        </Badge>
                    </div>
                    {service.pricing && (
                        <p className="mt-4 text-3xl font-bold text-amber-600">${Number(service.pricing)}</p>
                    )}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Interested in this service?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-muted-foreground">
                                Contact us to discuss your requirements and get a customized quote.
                            </p>
                            <Link to="/account">
                                <Button>Get in Touch</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
