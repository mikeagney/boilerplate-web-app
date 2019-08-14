import uuid from 'uuidv4';

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
    return {
      items: this.store.ids.map(id => ({
        id,
        name: this.store.byId[id].name,
      })),
      nextCursor: null,
    };
  }

  async getCharacterById(characterId) {
    return this.store.byId[characterId];
  }

  async createCharacter(character) {
    const characterId = uuid();
    this.store.byId[characterId] = {
      ...character,
      characterId,
      createdDate: new Date(),
    };
    this.store.ids.push(characterId);
    return this.store.byId[characterId];
  }

  async patchCharacter(characterId, character) {
    if (!this.store.byId[characterId]) {
      return false;
    }
    // Not bothering to remove keys with null values
    this.store.byId[characterId] = {
      ...this.store.byId[character],
      ...character,
    };
    return true;
  }

  async replaceCharacter(characterId, character) {
    if (!this.store.byId[characterId]) {
      return false;
    }
    this.store.byId[characterId] = {
      ...character,
      characterId: this.store.byId[characterId].characterId,
      createdDate: this.store.byId[characterId].createdDate,
    };
    return true;
  }

  async deleteCharacter(characterId) {
    if (!this.store.byId[characterId]) {
      return false;
    }
    delete this.store.byId[characterId];
    this.store.ids = this.store.ids.filter(id => id !== characterId);
    return true;
  }
}

export default MockCharacterProxy;
