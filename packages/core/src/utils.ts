export function isRelativeURL(url: string): boolean {
  return !/^(https?:\/\/|\/\/)/.test(url);
}

export interface DQLFileName {
  language: string;
  region: NewsRegion;
}

export enum NewsRegion {
  US = 'us',
  IN = 'in',
}

export function isDQLFileNameValid(filename: string): boolean {
  const pattern = /^[a-zA-Z0-9-]+_[a-z]+_[a-z]+\.dql$/;
  return pattern.test(filename);
}

export function parseDQLFileName(filename: string): DQLFileName {
  const [domain, region] = filename.split('_');

  const fixedDomain = `https://${domain.replace('-', '.')}`;

  new URL(fixedDomain);

  if (!(region in NewsRegion)) {
    throw new Error(`Invalid region: ${region}`);
  }

  return {
    domain: fixedDomain,
    region,
  };
}
