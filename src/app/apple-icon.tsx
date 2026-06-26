import { ImageResponse } from "next/og";
import { loadPinyonFont } from "@/lib/favicon-font";
import { PgFaviconMark } from "@/lib/favicon-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await loadPinyonFont();

  return new ImageResponse(
    (
      <PgFaviconMark
        fontSize={88}
        borderRadius={36}
        borderWidth={2}
        shiftX={-5}
        paddingTop={6}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pinyon Script",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
