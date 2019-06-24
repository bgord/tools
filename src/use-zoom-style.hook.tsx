import React from "react";

interface ZoomStylesOptions {
	maxZoomLevel: number;
	minZoomLevel: number;
}

interface ZoomTransform {
	transform: string;
}

type ZoomStyles = [ZoomTransform, {[index: string]: () => void}];

const defaultImageZoomOptions: ZoomStylesOptions = {
	maxZoomLevel: 5,
	minZoomLevel: 1,
};

type ZoomState = number;

const ZOOM_IN_ACTION = "ZOOM_IN_ACTION";
const ZOOM_OUT_ACTION = "ZOOM_OUT_ACTION";
const RESET_ZOOM_ACTION = "RESET";

interface ZoomInAction {
	type: typeof ZOOM_IN_ACTION;
}

interface ZoomOutAction {
	type: typeof ZOOM_OUT_ACTION;
}

interface ResetZoomAction {
	type: typeof RESET_ZOOM_ACTION;
}

type ZoomActions = ZoomInAction | ZoomOutAction | ResetZoomAction;

type ZoomReducer = (state: ZoomState, action: ZoomActions) => ZoomState;

interface CustomZoomReducerPayload {
	action: ZoomActions;
	changes: ZoomState;
	options: ZoomStylesOptions;
}

type CustomZoomReducer = (
	state: ZoomState,
	payload: CustomZoomReducerPayload,
) => ZoomState;

export function useImageZoomStyle({
	optionsOverrides = {},
	reducer = (state, payload) => payload.changes,
}: {
	optionsOverrides?: ZoomStylesOptions | {};
	reducer?: CustomZoomReducer;
} = {}): ZoomStyles {
	const options: ZoomStylesOptions = {
		...defaultImageZoomOptions,
		...optionsOverrides,
	};

	const zoomReducer: ZoomReducer = (state, action) => {
		switch (action.type) {
			case useImageZoomStyle.types.zoomIn:
				return state < options.maxZoomLevel ? state + 1 : state;
			case useImageZoomStyle.types.zoomOut:
				return state > options.minZoomLevel ? state - 1 : state;
			case useImageZoomStyle.types.reset:
				return options.minZoomLevel;
			default:
				throw new Error(`Unknown action type: ${action.type}`); // fail fast
		}
	};

	const [zoomLevel, dispatch] = React.useReducer<ZoomReducer, ZoomState>(
		(state, action) => {
			const changes = zoomReducer(state, action);
			return reducer(state, {action, changes, options});
		},
		options.minZoomLevel,
		() => options.minZoomLevel,
	);

	const zoomStyle: ZoomTransform = {
		transform: `scale(${zoomLevel})`,
	};

	return [
		zoomStyle,
		{
			zoomIn: () => dispatch({type: ZOOM_IN_ACTION}),
			zoomOut: () => dispatch({type: ZOOM_OUT_ACTION}),
			reset: () => dispatch({type: RESET_ZOOM_ACTION}),
		},
	];
}

useImageZoomStyle.types = {
	zoomIn: ZOOM_IN_ACTION,
	zoomOut: ZOOM_OUT_ACTION,
	reset: RESET_ZOOM_ACTION,
};
