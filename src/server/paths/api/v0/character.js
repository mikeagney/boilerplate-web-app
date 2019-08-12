import Joi from '@hapi/joi';
import router from 'express-promise-router';
import ControllerBase from '../../controller-base';
import CharacterProxy from '../../../proxy/character-proxy';
import HttpError from '../../../http-error';

class Character extends ControllerBase {
  constructor(proxy = new CharacterProxy()) {
    super();
    this.proxy = proxy;
  }

  getCharacterIdsSchema = () =>
    Joi.object({
      query: Joi.object({
        cursor: Joi.string().default(null),
        limit: Joi.number()
          .integer()
          .positive()
          .default(10),
      }).unknown(true),
    }).unknown(true);

  createCharacterSchema = () =>
    Joi.object({
      body: Joi.object({
        name: Joi.string().required(),
        characterId: Joi.string(), // Allowed but ignored
        createdDate: Joi.string(), // Allowed but ignored
      }).required(),
    }).unknown(true);

  getCharacterIds = async (req, res) => {
    const {
      query: { limit, cursor },
    } = await ControllerBase.validateRequest(req, this.getCharacterIdsSchema());
    const ids = await this.proxy.getCharacterIds(limit, cursor);
    res.type('application/json').send({
      ...ids,
      items: ids.items.map(character => ({
        ...character,
        href: `${req.baseUrl}/${character.id}`,
      })),
    });
  };

  getCharacterById = async (req, res) => {
    const { characterId } = req.params;
    const character = await this.proxy.getCharacterById(characterId);

    if (!character) {
      throw new HttpError('Not Found', { status: 404 });
    }

    res.type('application/json').send(character);
  };

  createCharacter = async (req, res) => {
    const { body: character } = await ControllerBase.validateRequest(
      req,
      this.createCharacterSchema(),
    );
    const createdCharacter = await this.proxy.createCharacter(character);
    res
      .status(201)
      .location(`${req.baseUrl}/${createdCharacter.characterId}`)
      .type('application/json')
      .send(createdCharacter);
  };

  initialize() {
    this.router = router();
    this.router.get('/:characterId', this.getCharacterById);
    this.router.get('/', this.getCharacterIds);
    this.router.post('/', this.createCharacter);
    return this;
  }
}

export default Character;
