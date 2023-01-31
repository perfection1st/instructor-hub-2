const PageNotFound = require("./setupTests");

test("returns Page Not Found", () => {
  expect(PageNotFound()).toStrictEqual(<h1>404 Page Not Found</h1>);
});
