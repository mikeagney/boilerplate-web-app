class MockCharacterProxy {
  constructor() {
    this.store = {
      byId: {
        a1: {
          characterId: 'a1',
          name: 'Armus',
        },
        b2: {
          characterId: 'b2',
          name: 'The Caretaker',
        },
      },
      ids: ['a1', 'b2'],
    };
  }

  async getCharacterIds() {
    return this.store.ids;
  }

  async getCharacterById(characterId) {
    return this.store.byId[characterId];
  }
}

export default MockCharacterProxy;
