import { ImageResponse } from "next/og";

/**
 * Replaces create-next-app's default favicon: a sodium lamp on the night
 * ground — the one accent the site keeps for Bill's voice and the $60 bar.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080C17",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: "#FF9A3C",
            boxShadow: "0 0 8px #FF9A3C",
          }}
        />
      </div>
    ),
    size
  );
}
