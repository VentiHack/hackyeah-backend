import { Sequelize, DataTypes, Model } from 'sequelize';

const inMemory = false;

const sequelize = new Sequelize(inMemory ? 'sqlite:memory:' : 'sqlite://data.db');


const createRegion = async (x: number, y: number): Promise<typeof region> => {
  const name = `region_${x}x${y}`;
  const region = class extends Model {};
  
  await region.init({
    img: DataTypes.STRING,
    animalSpecies: DataTypes.STRING,
    knownAnimalSpecies: DataTypes.BOOLEAN,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    additionalInfo: DataTypes.STRING,
  }, { sequelize, modelName: name, tableName: name, freezeTableName: true });

  await region.sync();

  return region; 
};

type Region = Awaited<ReturnType<typeof createRegion>>;

const regions: Region[][] = [];

export const getRegion = async (x: number, y: number): Promise<Region> => {
  if (!regions[x])
    regions[x] = [];

  const region = regions[x][y];

  if (!region)
    return regions[x][y] = await createRegion(x, y);

  return region;
};
