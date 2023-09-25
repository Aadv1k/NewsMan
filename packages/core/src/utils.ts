// nytimes-com.dql -> nytimes.com
export function convertKebabCaseToURL(name: string): string {
  if (!name || name.indexOf('-') === -1) throw new Error('Invalid input: Name must be a kebab-case string with at least one hyphen.');
  const [filename, ext] = name.split('.');
  const [top, rest] = filename.split('-');
  if (!top || !rest) throw new Error('Invalid input: Name must have a non-empty left and right part separated by a hyphen.');
  const urlFriendlyName = `https://${top}.${rest}`;
  try {
    new URL(urlFriendlyName);
    return urlFriendlyName;
  } catch {
    throw new Error('Invalid input: Resulting URL is not valid.');
  }
}

export function isRelativeURL(url: string): boolean {
    return !/^(https?:\/\/|\/\/)/.test(url);
}
