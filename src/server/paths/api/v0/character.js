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

  createCharacterSchema = () =>
    Joi.object({
      body: Joi.object({
        name: Joi.string().required(),
        characterId: Joi.string(), // Allowed but ignored
        createdDate: Joi.string(), // Allowed but ignored
      }).required(),
    }).unknown(true);

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

  patchCharacterSchema = () =>
    Joi.object({
      params: Joi.object({
        characterId: Joi.string().required(),
      }),
      body: Joi.object({
        name: Joi.string().allow(null),
        characterId: Joi.string().allow(null), // Allowed but ignored
        createdDate: Joi.string().allow(null), // Allowed but ignored
      }).required(),
    }).unknown(true);

  patchCharacter = async (req, res) => {
    const {
      params: { characterId },
      body: character,
    } = await ControllerBase.validateRequest(req, this.patchCharacterSchema());
    const isChanged = await this.proxy.patchCharacter(characterId, character);
    if (!isChanged) {
      throw new HttpError('Not Found', { status: 404 });
    }
    res.status(204).end();
  };

  replaceCharacterSchema = () =>
    Joi.object({
      params: Joi.object({
        characterId: Joi.string().required(),
      }),
      body: Joi.object({
        name: Joi.string().required(),
        characterId: Joi.string(), // Allowed but ignored
        createdDate: Joi.string(), // Allowed but ignored
      }).required(),
    }).unknown(true);

  replaceCharacter = async (req, res) => {
    const {
      params: { characterId },
      body: character,
    } = await ControllerBase.validateRequest(req, this.replaceCharacterSchema());
    const isChanged = await this.proxy.replaceCharacter(characterId, character);
    if (!isChanged) {
      throw new HttpError('Not Found', { status: 404 });
    }
    res.status(204).end();
  };

  deleteCharacterSchema = () =>
    Joi.object({
      params: Joi.object({
        characterId: Joi.string().required(),
      }),
    }).unknown(true);

  deleteCharacter = async (req, res) => {
    const {
      params: { characterId },
    } = await ControllerBase.validateRequest(req, this.deleteCharacterSchema());
    const isDeleted = await this.proxy.deleteCharacter(characterId);
    if (!isDeleted) {
      throw new HttpError('Not Found', { status: 404 });
    }
    res.status(204).end();
  };

  initialize() {
    this.router = router();
    this.router.get('/:characterId', this.getCharacterById);
    this.router.patch('/:characterId', this.patchCharacter);
    this.router.put('/:characterId', this.replaceCharacter);
    this.router.delete('/:characterId', this.deleteCharacter);
    this.router.get('/', this.getCharacterIds);
    this.router.post('/', this.createCharacter);
    return this;
  }
}

export default Character;
