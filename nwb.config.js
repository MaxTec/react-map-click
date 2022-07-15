module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactMapClick',
      externals: {
        react: 'React',
      },
    },
  },
};
