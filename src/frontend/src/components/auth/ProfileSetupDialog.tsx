import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
    const [name, setName] = useState('');
    const saveProfile = useSaveCallerUserProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }
        try {
            await saveProfile.mutateAsync({ name: name.trim() });
            toast.success('Profile created successfully!');
        } catch (error) {
            toast.error('Failed to create profile');
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Welcome!</DialogTitle>
                    <DialogDescription>Please tell us your name to get started.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            autoFocus
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
                        {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
