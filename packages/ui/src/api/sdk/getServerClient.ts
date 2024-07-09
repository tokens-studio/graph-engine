import { QueryClient } from '@tanstack/query-core';
import { cache } from 'react';

export const getServerClient = cache(() => new QueryClient());
