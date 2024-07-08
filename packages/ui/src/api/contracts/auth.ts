
import { AppRouteMutation, AppRouteQuery } from '@ts-rest/core';
import { z } from 'zod';

export const contract: Record<string, AppRouteMutation | AppRouteQuery> = {
    getWhoAmI: {
        method: 'GET',
        path: '/auth/whoami',
        responses: {
            200: z.object({
                user: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    email: z.string().nullable(),
                    image: z.string().nullable(),
                })
            }),
            401: z.any(),
        },
    },
    updateUser: {
        method: 'PUT',
        path: '/auth/details',
        body: z.object({
            name: z.string().nullable().optional(),
            image: z.string().nullable().optional(),
        }),
        responses: {
            200: z.object({
                message: z.string()
            }),
            401: z.any(),
        },
    },
}



