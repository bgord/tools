import {renderHook, act} from "@testing-library/react-hooks";

import {useImageZoomStyle} from "../src/use-zoom-style.hook";

describe("use-zoom-style.hook", () => {
	it("returns default minZoomLevel transform", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
	});
	it("returns overriden minZoomLevel transform", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({optionsOverrides: {minZoomLevel: 2}}),
		);
		expect(result.current[0]).toEqual({transform: "scale(2)"});
	});
	it("allows to zoomIn", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(2)"});
	});
	it("allows to zoomOut", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
	});
	it("allows to zoomIn only up to default maxZoomLevel", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
	});
	it("allows to zoomIn only up to overriden maxZoomLevel", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({optionsOverrides: {maxZoomLevel: 3}}),
		);
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
	});
	it("allows to zoomOut only down to default minZoomLevel", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
		act(() => result.current[1].zoomOut());
		act(() => result.current[1].zoomOut());
		act(() => result.current[1].zoomOut());
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
	});
	it("allows to zoomOut only down to overriden minZoomLevel", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({optionsOverrides: {minZoomLevel: 2}}),
		);
		expect(result.current[0]).toEqual({transform: "scale(2)"});
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
		act(() => result.current[1].zoomOut());
		act(() => result.current[1].zoomOut());
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(2)"});
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(2)"});
	});
	it("allows to reset to a default zoom level ", () => {
		const {result} = renderHook(() => useImageZoomStyle());
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
		act(() => result.current[1].reset());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
	});
	it("allows to intercept a zoomIn action", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({
				reducer: (currentState, {action, changes}) => {
					if (action.type === useImageZoomStyle.types.zoomIn) {
						return currentState + 2;
					}
					return changes;
				},
			}),
		);
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(4)"});
	});
	it("allows to intercept a zoomOut action", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({
				reducer: (currentState, {action, changes}) => {
					if (action.type === useImageZoomStyle.types.zoomOut) {
						return currentState - 2;
					}
					return changes;
				},
			}),
		);
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
		act(() => result.current[1].zoomOut());
		expect(result.current[0]).toEqual({transform: "scale(1)"});
	});
	it("allows to intercept a reset action", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({
				reducer: (currentState, {action, changes}) => {
					if (action.type === useImageZoomStyle.types.reset) {
						return 5;
					}
					return changes;
				},
			}),
		);
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
		act(() => result.current[1].reset());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
	});
	it("allows to access options object in reducer function", () => {
		const {result} = renderHook(() =>
			useImageZoomStyle({
				reducer: (currentState, {action, changes, options}) => {
					if (action.type === useImageZoomStyle.types.reset) {
						return options.maxZoomLevel;
					}
					return changes;
				},
			}),
		);
		act(() => result.current[1].zoomIn());
		act(() => result.current[1].zoomIn());
		expect(result.current[0]).toEqual({transform: "scale(3)"});
		act(() => result.current[1].reset());
		expect(result.current[0]).toEqual({transform: "scale(5)"});
	});
});
