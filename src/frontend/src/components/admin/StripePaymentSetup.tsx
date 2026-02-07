import { useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../hooks/useStripeConfig';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StripePaymentSetup() {
    const { data: isConfigured, isLoading } = useIsStripeConfigured();
    const setConfig = useSetStripeConfiguration();
    const [formData, setFormData] = useState({
        secretKey: '',
        allowedCountries: 'US,CA,GB'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const countries = formData.allowedCountries.split(',').map((c) => c.trim());
            await setConfig.mutateAsync({
                secretKey: formData.secretKey,
                allowedCountries: countries
            });
            toast.success('Stripe configuration saved successfully');
            setFormData({ secretKey: '', allowedCountries: 'US,CA,GB' });
        } catch (error) {
            toast.error('Failed to save Stripe configuration');
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Stripe Payment Configuration</CardTitle>
                <CardDescription>Configure Stripe to accept payments from customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isConfigured ? (
                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            Stripe is configured and ready to accept payments. You can update the configuration below.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert>
                        <AlertDescription>
                            Stripe is not configured yet. Please enter your Stripe secret key to enable payments.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="secretKey">Stripe Secret Key</Label>
                        <Input
                            id="secretKey"
                            type="password"
                            value={formData.secretKey}
                            onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                            placeholder="sk_test_..."
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Your secret key is stored securely and never exposed to the frontend
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allowedCountries">Allowed Countries (comma-separated)</Label>
                        <Input
                            id="allowedCountries"
                            value={formData.allowedCountries}
                            onChange={(e) => setFormData({ ...formData, allowedCountries: e.target.value })}
                            placeholder="US,CA,GB"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Example: US,CA,GB,AU (use ISO 3166-1 alpha-2 country codes)
                        </p>
                    </div>

                    <Button type="submit" disabled={setConfig.isPending}>
                        {setConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isConfigured ? 'Update Configuration' : 'Configure Stripe'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
