export default function Logo({ size = 36, style = {} }) {
  return (
    <img
      src="/milogo.png"
      alt="AI Market Intel"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: size > 50 ? 12 : 6,
        ...style,
      }}
    />
  );
}
