# bgord-tools

[![Build Status](https://travis-ci.org/bgord/tools.svg?branch=master)](https://travis-ci.org/bgord/tools)

A toolbox for writing React applications.

---

Table of content:

- [hooks](#Hooks)
  - [useZoomStyles](#useZoomStyles)
  - [useDocumentTitle](#useDocumentTitle)

### Hooks

#### useZoomStyles

Hook signature:

```jsx
function useZoomStyles(config: {
  optionOverrides:{
    minZoomLevel: number; // default 1
    maxZoomLevel: number; // default 5
  },
  reducer: (state, {action, changes, options}) => nextState
}) {
  // ...
  return [{ transform: string }, {
    zoomIn: () => void
    zoomOut: () => void
    reset: () => void
  }];
}
```

Usage:

```jsx
function App() {
	// basic usage
	const [zoomStyles, handlers] = useZoomStyles();

	// with option overrides
	const [zoomStyles, handlers] = useZoomStyles({
		optionOverrides: {
			minZoomLevel: 2,
		},
	});

	// with state reducer
	const [zoomStyles, handlers] = useZoomStyles({
		reducer: (state, {action, changes, options}) => {
			if (action.type === useZoomStyles.types.zoomIn) {
				return state + 2; // hook into internal state update
			}
			return changes;
		},
	});

	return (
		<>
			<button onClick={handlers.zoomIn}>Zoom In</button>
			<button onClick={handlers.zoomOut}>Zoom Out</button>
			<img
				src="https://via.placeholder.com/150C/O"
				styles={{...zoomStyles}}
				onClick={handlers.reset}
			/>
		</>
	);
}
```

#### useDocumentTitle

Hook signature:

```jsx
function useDocumentTitle(title: string): void {}
```

Usage:

```jsx
function Component(props) {
	useDocumentTitle(props.title);

	return <div />;
}
```
