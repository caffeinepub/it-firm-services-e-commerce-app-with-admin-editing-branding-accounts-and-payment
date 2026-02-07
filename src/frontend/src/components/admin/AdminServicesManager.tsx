import { useState } from 'react';
import { useGetServices } from '../../hooks/useServices';
import { useCreateService, useDeleteService } from '../../hooks/useAdminServices';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ServiceItem } from '../../backend';

export default function AdminServicesManager() {
    const { data: services, isLoading } = useGetServices();
    const createService = useCreateService();
    const deleteService = useDeleteService();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        pricing: '',
        imageUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const serviceData: ServiceItem = {
                id: BigInt(0),
                title: formData.title,
                description: formData.description,
                category: formData.category,
                pricing: formData.pricing ? BigInt(formData.pricing) : undefined,
                imageUrl: formData.imageUrl || undefined
            };
            await createService.mutateAsync(serviceData);
            toast.success('Service created successfully');
            setOpen(false);
            setFormData({ title: '', description: '', category: '', pricing: '', imageUrl: '' });
        } catch (error) {
            toast.error('Failed to create service');
        }
    };

    const handleDelete = async (id: bigint) => {
        if (confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteService.mutateAsync(id);
                toast.success('Service deleted successfully');
            } catch (error) {
                toast.error('Failed to delete service');
            }
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Services</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pricing">Pricing (optional)</Label>
                                <Input
                                    id="pricing"
                                    type="number"
                                    value={formData.pricing}
                                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={createService.isPending}>
                                {createService.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Service
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : services && services.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Pricing</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={Number(service.id)}>
                                    <TableCell className="font-medium">{service.title}</TableCell>
                                    <TableCell>{service.category}</TableCell>
                                    <TableCell>
                                        {service.pricing ? `$${Number(service.pricing)}` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(service.id)}
                                            disabled={deleteService.isPending}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="py-8 text-center text-muted-foreground">No services yet</p>
                )}
            </CardContent>
        </Card>
    );
}
