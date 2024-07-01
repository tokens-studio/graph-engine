export interface Paginated {
	/**
	 * @minimum 1
	 * @maximum 20
	 * @default 10
	 * @isInt
	 * The number of items to return
	 */
	perPage: number;
	/**
	 * @minimum 0
	 * @default 0
	 * @isInt
	 * The page number to return
	 */
	page: number;
}

export const bar = 1;
