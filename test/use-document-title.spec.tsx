import {render} from "@testing-library/react";
import * as React from "react";

import {useDocumentTitle} from "../src";

function App() {
	useDocumentTitle("tools");
	return <div />;
}

describe("useDocumentTitle", () => {
	it("should set a document title", () => {
		render(<App />);
		expect(window.document.title).toEqual("tools");
	});
});
