import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Lock } from 'lucide-react';

interface RequireAuthProps {
    children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
    const { identity } = useInternetIdentity();

    if (!identity) {
        return (
            <div className="container mx-auto max-w-md px-4 py-16">
                <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>Please sign in to access this page.</AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <LoginButton />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
