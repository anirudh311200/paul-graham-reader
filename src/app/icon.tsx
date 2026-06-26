import { ImageResponse } from "next/og";
import { loadPinyonFont } from "@/lib/favicon-font";
import { PgFaviconMark } from "@/lib/favicon-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await loadPinyonFont();

  return new ImageResponse(
    (
      <PgFaviconMark
        fontSize={17}
        borderRadius={7}
        borderWidth={1}
        shiftX={-2}
        paddingTop={2}
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
