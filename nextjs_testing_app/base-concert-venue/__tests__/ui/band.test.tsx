import { render, screen } from "@testing-library/react";
import BandComponent from "@/pages/bands/[bandId]";
import { readFakeData } from "@/__tests__/__mocks__/fakeData";

test("Band component displays correct band information", async () => {
  const { fakeBands } = await readFakeData();
  render(<BandComponent band={fakeBands[0]} error={null} />);

  const heading = screen.getByRole("heading", {
    name: fakeBands[0].name,
  });
  expect(heading).toBeInTheDocument();
});

test("Description of band is there", async () => {
  const { fakeBands } = await readFakeData();
  render(<BandComponent band={fakeBands[0]} error={null} />);

  const description = screen.getByText(fakeBands[0].description);
  expect(description).toBeInTheDocument();
});

test("Error gets correctly thrown", () => {
  render(<BandComponent band={null} error={"Nothing to see here"} />);
  const heading = screen.getByRole("heading", {
    name: /nothing to see here/i,
  });
  expect(heading).toBeInTheDocument();
});
