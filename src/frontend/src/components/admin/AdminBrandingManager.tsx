import { useState, useEffect } from 'react';
import { useGetSiteBranding, useUpdateBranding } from '../../hooks/useBranding';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import BrandingImageUrlListField from './BrandingImageUrlListField';
import { Separator } from '../ui/separator';
import type { Language } from '../../backend';

export default function AdminBrandingManager() {
    const { data: branding, isLoading } = useGetSiteBranding();
    const updateBranding = useUpdateBranding();
    const [formData, setFormData] = useState({
        logo: '',
        homepageSliderImages: [] as string[],
        storeBanners: [] as string[],
        socialLinks: {
            facebook: '',
            whatsapp: '',
            youtube: ''
        },
        languageConfig: {
            availableLanguages: [] as Language[],
            defaultLanguage: ''
        }
    });

    useEffect(() => {
        if (branding) {
            setFormData({
                logo: branding.logo || '',
                homepageSliderImages: branding.homepageSliderImages || [],
                storeBanners: branding.storeBanners || [],
                socialLinks: {
                    facebook: branding.socialLinks?.facebook || '',
                    whatsapp: branding.socialLinks?.whatsapp || '',
                    youtube: branding.socialLinks?.youtube || ''
                },
                languageConfig: {
                    availableLanguages: branding.languageConfig?.availableLanguages || [],
                    defaultLanguage: branding.languageConfig?.defaultLanguage || ''
                }
            });
        }
    }, [branding]);

    const isValidUrl = (url: string): boolean => {
        if (!url) return true; // Empty is valid (optional)
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate social links
        if (formData.socialLinks.facebook && !isValidUrl(formData.socialLinks.facebook)) {
            toast.error('Invalid Facebook URL');
            return;
        }
        if (formData.socialLinks.whatsapp && !isValidUrl(formData.socialLinks.whatsapp)) {
            toast.error('Invalid WhatsApp URL');
            return;
        }
        if (formData.socialLinks.youtube && !isValidUrl(formData.socialLinks.youtube)) {
            toast.error('Invalid YouTube URL');
            return;
        }

        // Validate languages
        for (const lang of formData.languageConfig.availableLanguages) {
            if (!lang.code.trim() || !lang.name.trim()) {
                toast.error('Language code and name cannot be empty');
                return;
            }
        }

        // Validate default language exists in available languages
        if (formData.languageConfig.defaultLanguage) {
            const defaultExists = formData.languageConfig.availableLanguages.some(
                lang => lang.code === formData.languageConfig.defaultLanguage
            );
            if (!defaultExists && formData.languageConfig.availableLanguages.length > 0) {
                toast.error('Default language must be one of the available languages');
                return;
            }
        }

        try {
            await updateBranding.mutateAsync({
                logo: formData.logo || undefined,
                homepageSliderImages: formData.homepageSliderImages,
                storeBanners: formData.storeBanners,
                socialLinks: formData.socialLinks,
                languageConfig: formData.languageConfig
            });
            toast.success('Branding updated successfully');
        } catch (error) {
            toast.error('Failed to update branding');
        }
    };

    const addLanguage = () => {
        setFormData({
            ...formData,
            languageConfig: {
                ...formData.languageConfig,
                availableLanguages: [
                    ...formData.languageConfig.availableLanguages,
                    { code: '', name: '' }
                ]
            }
        });
    };

    const removeLanguage = (index: number) => {
        const newLanguages = formData.languageConfig.availableLanguages.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            languageConfig: {
                ...formData.languageConfig,
                availableLanguages: newLanguages
            }
        });
    };

    const updateLanguage = (index: number, field: 'code' | 'name', value: string) => {
        const newLanguages = [...formData.languageConfig.availableLanguages];
        newLanguages[index] = { ...newLanguages[index], [field]: value };
        setFormData({
            ...formData,
            languageConfig: {
                ...formData.languageConfig,
                availableLanguages: newLanguages
            }
        });
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
                <CardTitle>Site Branding</CardTitle>
                <CardDescription>Manage your site's visual identity, social links, and language options</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Logo Section */}
                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                            id="logo"
                            type="url"
                            value={formData.logo}
                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                        />
                        {formData.logo && (
                            <div className="mt-2">
                                <img src={formData.logo} alt="Logo preview" className="h-16 w-auto" />
                            </div>
                        )}
                    </div>

                    <BrandingImageUrlListField
                        label="Homepage Slider Images"
                        description="Add multiple images to display in a carousel on the homepage"
                        value={formData.homepageSliderImages}
                        onChange={(urls) => setFormData({ ...formData, homepageSliderImages: urls })}
                    />

                    <BrandingImageUrlListField
                        label="Store & Product Banner Images"
                        description="Add banner images to display at the top of store and product pages"
                        value={formData.storeBanners}
                        onChange={(urls) => setFormData({ ...formData, storeBanners: urls })}
                    />

                    <Separator />

                    {/* Social Links Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Social Links</h3>
                            <p className="text-sm text-muted-foreground">Add links to your social media profiles</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook URL</Label>
                            <Input
                                id="facebook"
                                type="url"
                                value={formData.socialLinks.facebook}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                })}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp URL</Label>
                            <Input
                                id="whatsapp"
                                type="url"
                                value={formData.socialLinks.whatsapp}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, whatsapp: e.target.value }
                                })}
                                placeholder="https://wa.me/+1234567890"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube URL</Label>
                            <Input
                                id="youtube"
                                type="url"
                                value={formData.socialLinks.youtube}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                                })}
                                placeholder="https://youtube.com/@yourchannel"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Language Configuration Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Language Selector</h3>
                            <p className="text-sm text-muted-foreground">Configure available languages for your site</p>
                        </div>

                        <div className="space-y-4">
                            {formData.languageConfig.availableLanguages.map((lang, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor={`lang-code-${index}`}>Language Code</Label>
                                        <Input
                                            id={`lang-code-${index}`}
                                            value={lang.code}
                                            onChange={(e) => updateLanguage(index, 'code', e.target.value)}
                                            placeholder="en"
                                            maxLength={10}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor={`lang-name-${index}`}>Language Name</Label>
                                        <Input
                                            id={`lang-name-${index}`}
                                            value={lang.name}
                                            onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                            placeholder="English"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLanguage(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addLanguage}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Language
                            </Button>
                        </div>

                        {formData.languageConfig.availableLanguages.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="defaultLanguage">Default Language</Label>
                                <Input
                                    id="defaultLanguage"
                                    value={formData.languageConfig.defaultLanguage}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        languageConfig: {
                                            ...formData.languageConfig,
                                            defaultLanguage: e.target.value
                                        }
                                    })}
                                    placeholder="en"
                                    maxLength={10}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the language code that should be selected by default
                                </p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={updateBranding.isPending}>
                        {updateBranding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Branding
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
