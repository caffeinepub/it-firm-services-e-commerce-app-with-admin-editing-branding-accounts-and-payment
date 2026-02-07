import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServiceItem } from '../backend';

export function useCreateService() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (service: ServiceItem) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createService(service);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: bigint) => {
            // Note: Backend doesn't have delete method, so this is a placeholder
            throw new Error('Delete not implemented in backend');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        }
    });
}
