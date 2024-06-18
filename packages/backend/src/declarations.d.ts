
declare module "express-prometheus-middleware" {

    function middleware(options: {
        metricsPath: string,
        collectDefaultMetrics: boolean,
        requestDurationBuckets: number[],
        requestLengthBuckets: number[],
        responseLengthBuckets: number[],
    }): any;

    export default middleware;

}

