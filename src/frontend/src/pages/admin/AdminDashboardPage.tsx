import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import AdminServicesManager from '../../components/admin/AdminServicesManager';
import AdminProductsManager from '../../components/admin/AdminProductsManager';
import AdminBrandingManager from '../../components/admin/AdminBrandingManager';
import StripePaymentSetup from '../../components/admin/StripePaymentSetup';
import { toast } from 'sonner';
import { copyToClipboard } from '../../utils/copyToClipboard';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('services');

    const handleCopyLink = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            toast.success('Link copied');
        } else {
            toast.error('Could not copy link');
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
                <Button variant="outline" onClick={handleCopyLink}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy link
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="mt-6">
                    <AdminServicesManager />
                </TabsContent>

                <TabsContent value="products" className="mt-6">
                    <AdminProductsManager />
                </TabsContent>

                <TabsContent value="branding" className="mt-6">
                    <AdminBrandingManager />
                </TabsContent>

                <TabsContent value="payments" className="mt-6">
                    <StripePaymentSetup />
                </TabsContent>
            </Tabs>
        </div>
    );
}
