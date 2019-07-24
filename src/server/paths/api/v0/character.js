import express from 'express';
import jsonSerialize from 'serialize-javascript';
import CharacterProxy from '../../../proxy/character-proxy';

class Character {
  constructor(proxy = new CharacterProxy()) {
    this.proxy = proxy;
  }

  getCharacterIds = async (_req, res) => {
    const ids = await this.proxy.getCharacterIds();
    res.type('application/json').send(jsonSerialize(ids));
  };

  getCharacterById = async (req, res) => {
    const { characterId } = req.params;
    const character = await this.proxy.getCharacterById(characterId);

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
