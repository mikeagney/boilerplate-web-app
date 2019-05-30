import express from 'express';
import jsonSerialize from 'serialize-javascript';

class Character {
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

  getCharacterIds = (_req, res) => {
    res.type('application/json').send(jsonSerialize(this.store.ids));
  };

  getCharacterById = (req, res) => {
    const { characterId } = req.params;
    const character = this.store.byId[characterId];
    if (!character) {
      res
        .status(404)
        .type('application/json')
        .end();
      return;
    }

    res.type('application/json').send(jsonSerialize(character));
  };

  initialize() {
    this.router = express.Router();
    this.router.get('/:characterId', this.getCharacterById);
    this.router.get('/', this.getCharacterIds);
    return this;
  }
}

export default Character;
