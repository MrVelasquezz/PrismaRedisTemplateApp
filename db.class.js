// TODO пофиксить всю логику, что бы ничто не могло уложить программу

const Prisma = require('@prisma/client');

/**
 * Simple dbController class
 */
class DbController {
  /**
   * Just a constructor
   * @param {Prisma} ormObject
   * @param {Redis} cacheObject
   */
  constructor(ormObject, cacheObject) {
    this.prisma = ormObject;
    this.redis = cacheObject;
  }

  /**
   * Method which gets asked product from the database
   * @param {String} name - name of a product
   * @return {Object|Null}
   */
  async getFromCache(name) {
    try {
      const isInCache = await this.redis.hGetAll(name);

      return Object.keys(isInCache).length?Object.assign({}, isInCache):null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Method which synchronizes data in cache with data in db
   * @param {Object} data - object with product data
   * @return {Boolean|Null}
   */
  async syncCache(data) {
    try {
      if (!data) {
        return false;
      }
      const addedToCache = await this.redis.hSet(data.name,
          data,
      );

      if (addedToCache === Object.keys(data).length) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Method which writes to db data and caches it
   * @param {Object} data - object with product data
   * @return {Object}
   */
  async addToDb(data) {
    try {
      const wasInCache = await this.getFromCache(data.name);
      if (wasInCache) {
        return {
          status: 'Already exists',
          data: wasInCache,
          success: true,
        };
      }

      data = {
        name: data.name,
        price: data.price,
        description: data.desc,
      };

      const created = await this.prisma.products2.create(
          {
            data: data,
          },
      );

      const cacheSynced = await this.syncCache(created);
      return {
        data: created,
        cached: cacheSynced,
        success: true,
      };
    } catch (e) {
      // TODO разобраться с ошибками в призме и понять как их применять на благо
      if (e instanceof Prisma.PrismaClientValidationError) {
        console.log('Prisma encountered an error with code:\n', e.code);
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const cachedFromDb = await this.getFromDb(data.name);
          return {
            status: 'Already exists in database',
            addedToCache: cachedFromDb,
            success: false,
          };
        }
      } else if (e.code && e.meta) {
        console.log(e.code, e.meta);
      } else {
        console.log(e);
      }
    }
  }

  /**
   * Method which returns data from the database and caches it
   * @param {String} name - name of a product to search
   * @return {Object} object with data
   */
  async getFromDb(name) {
    try {
      const wasInCache = await this.getFromCache(name);
      if (wasInCache) {
        return wasInCache;
      }

      const dataFromDb = await this.prisma.products2.findUnique(
          {
            where: {
              name: name,
            },
          },
      );

      const cacheSynced = await this.syncCache(dataFromDb);
      return {
        data: dataFromDb,
        cached: cacheSynced,
        success: true,
      };
    } catch (e) {
      console.log(e);
      return {success: false};
    }
  }
}

module.exports = {DbController};
