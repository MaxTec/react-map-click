// solamente aplicaremos a la ventana

const common = {
  borderRadius: "4px",
  fontSize: "14px",
};
export const lightTheme = {
  ...common,
  primaryColor: "White",
  secondaryColor: "gray",
  body: "#E2E2E2",
  gradient: "linear-gradient(#39598A, #79D7ED)",
};

export const darkTheme = {
  ...common,
  primaryColor: "#000000",
  secondaryColor: "green",
  body: "#E2E2E2",
  gradient: "linear-gradient(#39598A, #79D7ED)",
};
