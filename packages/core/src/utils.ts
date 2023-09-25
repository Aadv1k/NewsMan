export function isRelativeURL(url: string): boolean {
  return !/^(https?:\/\/|\/\/)/.test(url);
}

const RegionCodes = new Set(["in", "us"]);

export interface DQLFileName {
  region: string;
  domain: string;
}

export function isDQLFileNameValid(filename: string): boolean {
  const pattern = /^[a-zA-Z0-9-]+_[a-z]+_[a-z]+\.dql$/;
  return pattern.test(filename);
}

export function parseDQLFileName(filename: string): DQLFileName {
  const [domain, region] = (filename.split('.').shift() as string).split('_');

  const fixedDomain = `https://${domain.replace('-', '.')}`;

  new URL(fixedDomain);

  if (!RegionCodes.has(region)) {
    throw new Error(`Invalid region: ${region}`);
  }

  return {
    domain: fixedDomain,
    region,
  };
}
