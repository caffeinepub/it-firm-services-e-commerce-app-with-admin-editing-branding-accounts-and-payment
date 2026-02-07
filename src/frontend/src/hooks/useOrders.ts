import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderItem, Product } from '../backend';

export function useGetCallerOrders() {
    const { actor, isFetching } = useActor();

    return useQuery<OrderItem[]>({
        queryKey: ['callerOrders'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getCallerOrders();
        },
        enabled: !!actor && !isFetching
    });
}

export function useCreateOrder() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ products, totalAmount }: { products: Product[]; totalAmount: bigint }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createOrder(products, totalAmount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['callerOrders'] });
        }
    });
}
