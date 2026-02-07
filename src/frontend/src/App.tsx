import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import CustomerLayout from './components/layouts/CustomerLayout';
import AdminLayout from './components/layouts/AdminLayout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function RootComponent() {
    const { identity } = useInternetIdentity();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
    const isAuthenticated = !!identity;
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

    return (
        <>
            {showProfileSetup && <ProfileSetupDialog />}
            <Outlet />
            <Toaster />
        </>
    );
}

const rootRoute = createRootRoute({
    component: RootComponent
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <CustomerLayout>
            <HomePage />
        </CustomerLayout>
    )
});

const servicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/services',
    component: () => (
        <CustomerLayout>
            <ServicesPage />
        </CustomerLayout>
    )
});

const serviceDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/services/$serviceId',
    component: () => (
        <CustomerLayout>
            <ServiceDetailPage />
        </CustomerLayout>
    )
});

const storeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/store',
    component: () => (
        <CustomerLayout>
            <StorePage />
        </CustomerLayout>
    )
});

const productDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/store/$productId',
    component: () => (
        <CustomerLayout>
            <ProductDetailPage />
        </CustomerLayout>
    )
});

const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/cart',
    component: () => (
        <CustomerLayout>
            <CartPage />
        </CustomerLayout>
    )
});

const checkoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/checkout',
    component: () => (
        <CustomerLayout>
            <CheckoutPage />
        </CustomerLayout>
    )
});

const accountRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/account',
    component: () => (
        <CustomerLayout>
            <AccountPage />
        </CustomerLayout>
    )
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => (
        <AdminLayout>
            <AdminDashboardPage />
        </AdminLayout>
    )
});

const paymentSuccessRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payment-success',
    component: () => (
        <CustomerLayout>
            <PaymentSuccessPage />
        </CustomerLayout>
    )
});

const paymentFailureRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payment-failure',
    component: () => (
        <CustomerLayout>
            <PaymentFailurePage />
        </CustomerLayout>
    )
});

const routeTree = rootRoute.addChildren([
    homeRoute,
    servicesRoute,
    serviceDetailRoute,
    storeRoute,
    productDetailRoute,
    cartRoute,
    checkoutRoute,
    accountRoute,
    adminRoute,
    paymentSuccessRoute,
    paymentFailureRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
