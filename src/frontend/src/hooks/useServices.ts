import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServiceItem } from '../backend';

export function useGetServices() {
    const { actor, isFetching } = useActor();

    return useQuery<ServiceItem[]>({
        queryKey: ['services'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getServices();
        },
        enabled: !!actor && !isFetching
    });
}
