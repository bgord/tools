import "jest-dom/extend-expect";

import React from "react";

import {render, cleanup} from "@testing-library/react";
import fetchMock from "fetch-mock";

import {useQuery} from "../src/use-query.hook";

afterEach(cleanup);

const SUCCESS_URL = "https://localhost:3000/api/body";
const ERROR_URL = "https://localhost:3000/api/response";

fetchMock
	.get(SUCCESS_URL, {
		name: "x",
		status: 200,
	})
	.get(ERROR_URL, 500);

const renderApp = (url: string) => {
	interface Props {
		url: string;
	}

	const App: React.FC<Props> = ({url}) => {
		const [state] = useQuery<{name: string}>(url);
		return (
			<div className="App">
				{state.status === "RUNNING" && <div>running</div>}
				{state.status === "SUCCESS" && (
					<div>
						<h2>success</h2>
						<pre>Name: {state.data ? state.data.name : null}</pre>
					</div>
				)}
				{state.status === "ERROR" && <div>{state.error}</div>}
			</div>
		);
	};

	return render(<App url={url} />);
};

describe("use-query.hook", () => {
	it("works in a basic happy path", async () => {
		const {queryByText, findByText} = renderApp(SUCCESS_URL);

		expect(queryByText(/running/)).toBeInTheDocument();
		expect(queryByText(/success/)).not.toBeInTheDocument();
		expect(queryByText(/error/)).not.toBeInTheDocument();

		await findByText(/success/);
		await findByText(/Name: x/);
		expect(queryByText(/running/)).not.toBeInTheDocument();
		expect(queryByText(/error/)).not.toBeInTheDocument();
	});
	it("works in a basic error path", async () => {
		const {queryByText, findByText} = renderApp(ERROR_URL);

		expect(queryByText(/running/)).toBeInTheDocument();
		expect(queryByText(/success/)).not.toBeInTheDocument();
		expect(queryByText(/query failed/)).not.toBeInTheDocument();

		await findByText(/query failed/i);

		expect(queryByText(/success/i)).not.toBeInTheDocument();
		expect(queryByText(/running/)).not.toBeInTheDocument();
	});
});
