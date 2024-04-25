// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { $OpenApiTs } from './types.gen';

export class GraphService {
    /**
     * Creates a new graph for the user
     * @param data The data for the request.
     * @param data.requestBody
     * @returns CreatedGraph
     * @throws ApiError
     */
    public static createGraph(data: $OpenApiTs['/graph']['post']['req']): CancelablePromise<$OpenApiTs['/graph']['post']['res'][201]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/graph',
            body: data.requestBody,
            mediaType: 'application/json'
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.graphId
     * @returns unknown
     * @throws ApiError
     */
    public static getGraph(data: $OpenApiTs['/graph/{graphId}']['get']['req']): CancelablePromise<$OpenApiTs['/graph/{graphId}']['get']['res'][200]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/graph/{graphId}',
            path: {
                graphId: data.graphId
            },
            errors: {
                404: 'Graph not found'
            }
        });
    }
    
    /**
     * @param data The data for the request.
     * @param data.graphId
     * @returns unknown
     * @throws ApiError
     */
    public static deleteGraph(data: $OpenApiTs['/graph/{graphId}']['delete']['req']): CancelablePromise<$OpenApiTs['/graph/{graphId}']['delete']['res'][200]> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/graph/{graphId}',
            query: {
                graphId: data.graphId
            },
            errors: {
                404: 'Graph not found'
            }
        });
    }
    
}