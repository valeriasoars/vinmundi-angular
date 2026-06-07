export interface CountryModel {
  name: {
    common: string;
  };

  flags: {
    png: string;
    svg: string;
  };

  region: string;

  population: number;

  capital: string[];

  cca3: string;

  borders: string[];
  
  translations?: any;
}