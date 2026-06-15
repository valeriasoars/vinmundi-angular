export interface CountryModel {
  names: {
    common: string;
    official: string;
    alternates?: string[];
    native?: Record<string, { common: string; official: string }>;
    translations?: Record<string, { common: string; official: string }>; // 👈 era errado antes
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
  area?: {
    kilometers: number;
    miles: number;
  };
  capitals?: { name: string }[];
}
