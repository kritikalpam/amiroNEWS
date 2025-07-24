import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <title>Amironews Logo</title>
      <circle cx="128" cy="128" r="128" fill="#2C417A"/>
      <circle cx="128" cy="128" r="100" fill="#FFFFFF"/>
      <circle cx="128" cy="128" r="28" fill="#A93232"/>
    </svg>
  );
}
