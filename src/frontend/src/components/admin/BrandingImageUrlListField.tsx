import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X, Plus, AlertCircle } from 'lucide-react';

interface BrandingImageUrlListFieldProps {
    label: string;
    description?: string;
    value: string[];
    onChange: (urls: string[]) => void;
}

export default function BrandingImageUrlListField({
    label,
    description,
    value,
    onChange
}: BrandingImageUrlListFieldProps) {
    const [newUrl, setNewUrl] = useState('');
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const handleAdd = () => {
        if (newUrl.trim()) {
            onChange([...value, newUrl.trim()]);
            setNewUrl('');
        }
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
        const newErrors = { ...imageErrors };
        delete newErrors[index];
        setImageErrors(newErrors);
    };

    const handleImageError = (index: number) => {
        setImageErrors({ ...imageErrors, [index]: true });
    };

    const handleImageLoad = (index: number) => {
        const newErrors = { ...imageErrors };
        delete newErrors[index];
        setImageErrors(newErrors);
    };

    return (
        <div className="space-y-3">
            <div>
                <Label>{label}</Label>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    {value.map((url, index) => (
                        <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="url"
                                        value={url}
                                        onChange={(e) => {
                                            const newUrls = [...value];
                                            newUrls[index] = e.target.value;
                                            onChange(newUrls);
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                {url && (
                                    <div className="relative h-20 w-32 overflow-hidden rounded border bg-muted">
                                        {imageErrors[index] ? (
                                            <div className="flex h-full items-center justify-center text-destructive">
                                                <AlertCircle className="h-6 w-6" />
                                            </div>
                                        ) : (
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={() => handleImageError(index)}
                                                onLoad={() => handleImageLoad(index)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAdd} disabled={!newUrl.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>
        </div>
    );
}
