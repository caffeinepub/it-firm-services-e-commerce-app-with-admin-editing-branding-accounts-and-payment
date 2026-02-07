import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 py-6">
                <p className="text-center text-sm text-muted-foreground">
                    © 2026. Built with <Heart className="inline h-4 w-4 fill-amber-500 text-amber-500" /> using{' '}
                    <a
                        href="https://caffeine.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-amber-600 transition-colors"
                    >
                        caffeine.ai
                    </a>
                </p>
            </div>
        </footer>
    );
}
