import { WorkLocation } from './work-location.model';

export interface Country {
  name: string;
  code: string;
  capital: string;
  region: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  language: {
    code: string;
    iso639_2?: string;
    name: string;
    nativeName?: string;
  };
  flag: string;
}
