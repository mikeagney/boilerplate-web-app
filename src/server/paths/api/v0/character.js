import express from 'express';
import jsonSerialize from 'serialize-javascript';

class Character {
  constructor() {
    this.store = {
      ids: ['a1', 'b2'],
    };
  }

  getCharacterIds = (_req, res) => {
    res.type('application/json').send(jsonSerialize(this.store.ids));
  }

  initialize() {
    this.router = express.Router();
    this.router.get('/ids', this.getCharacterIds);
    return this;
  }
}

export default Character;
