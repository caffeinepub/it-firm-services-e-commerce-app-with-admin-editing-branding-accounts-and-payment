import { Link } from '@tanstack/react-router';
import { ShoppingCart, User, Menu, Globe, Link as LinkIcon } from 'lucide-react';
import { SiFacebook, SiWhatsapp, SiYoutube } from 'react-icons/si';
import { Button } from './ui/button';
import { useGetSiteBranding } from '../hooks/useBranding';
import { useCartStore } from '../state/cart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useLanguagePreference } from '../hooks/useLanguagePreference';
import LoginButton from './auth/LoginButton';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/copyToClipboard';

export default function Header() {
    const { data: branding } = useGetSiteBranding();
    const { items } = useCartStore();
    const { identity } = useInternetIdentity();
    const { data: userProfile } = useGetCallerUserProfile();
    const { data: isAdmin } = useIsCallerAdmin();
    const { selectedLanguage, changeLanguage, availableLanguages } = useLanguagePreference();
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const socialLinks = branding?.socialLinks;
    const showSocialLinks = socialLinks && (socialLinks.facebook || socialLinks.whatsapp || socialLinks.youtube);
    const showLanguageSelector = availableLanguages.length > 0;

    const handleCopyLink = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            toast.success('Link copied');
        } else {
            toast.error('Could not copy link');
        }
    };

    const SocialButtons = () => (
        <>
            {socialLinks?.facebook && (
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9"
                >
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <SiFacebook className="h-4 w-4" />
                    </a>
                </Button>
            )}
            {socialLinks?.whatsapp && (
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9"
                >
                    <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <SiWhatsapp className="h-4 w-4" />
                    </a>
                </Button>
            )}
            {socialLinks?.youtube && (
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9"
                >
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <SiYoutube className="h-4 w-4" />
                    </a>
                </Button>
            )}
        </>
    );

    const LanguageSelector = () => {
        if (!showLanguageSelector) return null;

        return (
            <Select value={selectedLanguage} onValueChange={changeLanguage}>
                <SelectTrigger className="h-9 w-[140px]">
                    <Globe className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    };

    const NavLinks = () => (
        <>
            <Link to="/">
                <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/services">
                <Button variant="ghost">Services</Button>
            </Link>
            <Link to="/store">
                <Button variant="ghost">Store</Button>
            </Link>
            {identity && (
                <Link to="/account">
                    <Button variant="ghost">
                        <User className="mr-2 h-4 w-4" />
                        {userProfile?.name || 'Account'}
                    </Button>
                </Link>
            )}
            {isAdmin && (
                <Link to="/admin">
                    <Button variant="outline" size="sm">
                        Admin
                    </Button>
                </Link>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        {branding?.logo ? (
                            <img src={branding.logo} alt="Logo" className="h-8 w-auto" />
                        ) : (
                            <span className="text-xl font-bold text-foreground">IT Solutions</span>
                        )}
                    </Link>
                    <nav className="hidden items-center gap-1 md:flex">
                        <NavLinks />
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {showSocialLinks && (
                        <>
                            <div className="hidden items-center md:flex">
                                <SocialButtons />
                            </div>
                            <Separator orientation="vertical" className="hidden h-6 md:block" />
                        </>
                    )}
                    {showLanguageSelector && (
                        <>
                            <div className="hidden md:block">
                                <LanguageSelector />
                            </div>
                            <Separator orientation="vertical" className="hidden h-6 md:block" />
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyLink}
                        className="hidden md:flex"
                        title="Copy link"
                    >
                        <LinkIcon className="h-5 w-5" />
                    </Button>
                    <Link to="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                    <div className="hidden md:block">
                        <LoginButton />
                    </div>
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="flex flex-col gap-4 pt-8">
                                <NavLinks />
                                {showSocialLinks && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-2">
                                            <SocialButtons />
                                        </div>
                                    </>
                                )}
                                {showLanguageSelector && (
                                    <>
                                        <Separator />
                                        <LanguageSelector />
                                    </>
                                )}
                                <Separator />
                                <Button
                                    variant="outline"
                                    onClick={handleCopyLink}
                                    className="justify-start"
                                >
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Copy link
                                </Button>
                                <Separator />
                                <LoginButton />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
