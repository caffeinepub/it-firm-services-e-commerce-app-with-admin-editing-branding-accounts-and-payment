import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SiteBranding } from '../backend';

export function useGetSiteBranding() {
    const { actor, isFetching } = useActor();

    return useQuery<SiteBranding>({
        queryKey: ['branding'],
        queryFn: async () => {
            if (!actor) {
                return {
                    logo: undefined,
                    homepageSliderImages: [],
                    storeBanners: [],
                    socialLinks: {
                        facebook: '',
                        whatsapp: '',
                        youtube: ''
                    },
                    languageConfig: {
                        availableLanguages: [],
                        defaultLanguage: ''
                    }
                };
            }
            return actor.getSiteBranding();
        },
        enabled: !!actor && !isFetching
    });
}

export function useUpdateBranding() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (branding: SiteBranding) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateBranding(branding);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branding'] });
        }
    });
}
