let mockConfig = {
  server: {
    db: {
      databaseName: 'boilerplate',
    },
  },
};

export const setConfig = jest.fn().mockImplementation((newConfig) => {
  mockConfig = newConfig;
});

const config = jest.fn().mockReturnValue(mockConfig);

export default config;
