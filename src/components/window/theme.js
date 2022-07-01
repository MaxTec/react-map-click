// solamente aplicaremos a la ventana

const common = {
  borderRadius: '4px',
  fontSize: '14px',
  borderWidth: '1px',
  shadow:
    'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;',
  button: {
    fontSize: '5px',
    fontWeight: '400',
  },
  color: {
    function: {
      info: '',
      success: '',
      warning: '',
      danger: '',
    },
    neutral: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    primary: '#000',
    secondary: '#fff',
    text: '#000000',
  },
};
export const lightTheme = {
  ...common,
  brandColor: {},
  borderRadius: '4px',
  button: {
    fontSize: '14px',
  },
  shadow:
    'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;',
  color: {
    function: {
      info: '',
      success: '',
      warning: '',
      danger: '',
    },
    neutral: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    primary: '#1890ff',
    secondary: 'white',
    text: '#444444',
  },
  functionColor: {
    info: '',
    success: '',
    warning: '',
    danger: '',
  },
  neutralColor: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  primaryColor: '#4281A4',
  secondaryColor: 'white',
  body: '#48A9A6',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
};

export const darkTheme = {
  ...common,
  borderWidth: '2px',
  primaryColor: '#000000',
  secondaryColor: 'white',
  body: '#E2E2E2',
  gradient: 'linear-gradient(#39598A, #79D7ED)',
};
