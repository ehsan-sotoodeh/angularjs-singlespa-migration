module.exports = {
  "transform": {
    "^.+\\.js?$": "babel-jest"
  },
  // setupFilesAfterEnv: ['./jest.setup.js'],
  "moduleNameMapper": {
    "\\.(css)$": "identity-obj-proxy",
    "\\.(png)$": "identity-obj-proxy",
    '@react-mf/root-config': '<rootDir>/__mocks__/root-config.js',
  }
}
