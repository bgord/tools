import React from "react";

import {useIsMounted} from "./use-is-mounted.hook";

const INIT_QUERY = "INIT_QUERY";
const RESOLVE_QUERY = "RESOLVE_QUERY";
const REGISTER_QUERY_ERROR = "REGISTER_QUERY_ERROR";

const IDLE = "IDLE";
const RUNNING = "RUNNING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

type QueryStatuses =
	| typeof IDLE
	| typeof RUNNING
	| typeof SUCCESS
	| typeof ERROR;

interface InitQueryAction {
	type: typeof INIT_QUERY;
}

interface ResolveQueryAction<T> {
	type: typeof RESOLVE_QUERY;
	payload: T;
}

interface RegisterQueryErrorAction {
	type: typeof REGISTER_QUERY_ERROR;
	payload: string;
}

type QueryActions<T> =
	| InitQueryAction
	| ResolveQueryAction<T>
	| RegisterQueryErrorAction;

interface QueryState<T> {
	status: QueryStatuses;
	data: T | null;
	retries: number;
	error?: string | null;
}

type QueryReducer<T> = (
	state: QueryState<T>,
	action: QueryActions<T>,
) => QueryState<T>;

export function useQuery<T>(
	url: string,
): [QueryState<T>, React.Dispatch<QueryActions<T>>] {
	const queryReducer: QueryReducer<T> = (state, action) => {
		switch (action.type) {
			case INIT_QUERY:
				return {
					status: RUNNING,
					data: null,
					error: null,
					retries: state.retries,
				};
			case RESOLVE_QUERY:
				return {
					status: SUCCESS,
					data: action.payload,
					error: null,
					retries: state.retries,
				};
			case REGISTER_QUERY_ERROR:
				return {
					status: ERROR,
					data: null,
					error: action.payload,
					retries: state.retries,
				};
			default:
				return state;
		}
	};

	const initialState: QueryState<T> = {
		status: IDLE,
		data: null,
		error: null,
		retries: 0,
	};

	const [state, dispatch] = React.useReducer<QueryReducer<T>, QueryState<T>>(
		queryReducer,
		initialState,
		() => initialState,
	);

	const isMounted = useIsMounted();

	React.useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function performRequst() {
			dispatch({type: INIT_QUERY});
			try {
				const data = await fetch(url, {method: "GET", signal}).then(response =>
					response.json(),
				);
				if (isMounted) {
					dispatch({type: RESOLVE_QUERY, payload: data});
				}
			} catch (error) {
				if (isMounted) {
					dispatch({
						type: REGISTER_QUERY_ERROR,
						payload: "Query failed",
					});
				}
			}
		}
		if (state.status !== "RUNNING") {
			dispatch({type: INIT_QUERY});
			performRequst();
		}
		return () => {
			controller.abort();
		};
	}, [state.retries, url]);

	return [state, dispatch];
}
