// solamente aplicaremos a la ventana

const common = {
  borderRadius: '5px',
  fontSize: '14px',
};
export const lightTheme = {
  ...common,
  primaryColor: 'blue',
  secondaryColor: 'white',
  body: '#E2E2E2',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
};

export const darkTheme = {
  ...common,
  primaryColor: '#000000',
  secondaryColor: 'white',
  body: '#E2E2E2',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
};
