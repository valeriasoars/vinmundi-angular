export interface CountryModel {
  names: {
    common: string;
    official: string;
    translations?: {
      por?: { common: string; official: string };
    };
  };

  codes: {
    alpha_2: string;
    alpha_3: string;
  };

  flag: {
    url_svg?: string;
    url_png?: string;
    emoji?: string;
  };

  classification?: {
    dependency?: boolean;
    sovereign?: boolean;
    iso_status?: string;
  };

  region?: string;
  subregion?: string;
  borders?: string[];


  population?: number;
  capitals?: { name: string }[];
}