import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAdmin';
import { Package, Settings, Image, CreditCard, Home, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { identity, clear } = useInternetIdentity();
    const { data: isAdmin, isLoading } = useIsCallerAdmin();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!identity || !isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/30">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                    <p className="mt-2 text-muted-foreground">You do not have permission to access this area.</p>
                    <Link to="/">
                        <Button className="mt-4">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-muted/20">
            <aside className="w-64 border-r border-border bg-card">
                <div className="flex h-16 items-center border-b border-border px-6">
                    <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
                </div>
                <nav className="space-y-1 p-4">
                    <Link to="/">
                        <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Site
                        </Button>
                    </Link>
                    <Separator className="my-2" />
                    <a href="#services">
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Services
                        </Button>
                    </a>
                    <a href="#products">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" />
                            Products
                        </Button>
                    </a>
                    <a href="#branding">
                        <Button variant="ghost" className="w-full justify-start">
                            <Image className="mr-2 h-4 w-4" />
                            Branding
                        </Button>
                    </a>
                    <a href="#payments">
                        <Button variant="ghost" className="w-full justify-start">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Payments
                        </Button>
                    </a>
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <Button variant="outline" className="w-full" onClick={clear}>
                        Logout
                    </Button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-8">{children}</div>
            </main>
        </div>
    );
}
