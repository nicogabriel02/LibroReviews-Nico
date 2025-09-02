// vitest.setup.ts
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// limpia el DOM después de cada test
afterEach(() => cleanup());

// mock básico de next/link para tests de componentes
vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...rest }: any) =>
      <a href={typeof href === "string" ? href : String(href)} {...rest}>{children}</a>,
  };
});
