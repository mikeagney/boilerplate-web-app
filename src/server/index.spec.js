describe('server entry point', () => {
  it('will initialize and listen when the entry point module is loaded', () => {
    let error;

    jest.isolateModules(() => {
      try {
        // Arrange
        const mockApp = {
          initialize: jest.fn().mockReturnThis(),
          listen: jest.fn(),
        };
        jest.doMock('./app', () => jest.fn(() => mockApp));

        // Act
        require('./index');

        // Assert
        expect(mockApp.initialize).toHaveBeenCalledTimes(1);
        expect(mockApp.listen).toHaveBeenCalledTimes(1);
      } catch (err) {
        error = err;
      }
    });

    if (error) {
      throw error;
    }
  });
});
