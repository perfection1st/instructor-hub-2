import React from "react";
import { App } from "./app/src/App";
import { render, cleanup } from "@testing-library/react";

afterEach(cleanup);

describe("App", () => {
  it("renders the login route by default", () => {
    const { getByText } = render(<App auth={false} />);
    expect(getByText("SIGN IN")).toBeInTheDocument();
  }),
    it("renders the home route when logged in", () => {
      const auth = {
        isLoggedIn: true,
      };
      const { getByText } = render(<App auth={auth} />);
      expect(getByText("Student List")).toBeInTheDocument();
    });
});
