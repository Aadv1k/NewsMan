export function isRelativeURL(url: string): boolean {
  return !/^(https?:\/\/|\/\/)/.test(url);
}

export function convertToDate(dateString: string): Date | null {
    const dateRegex = /(\w+) (\d{2}), (\d{4}) (\d{1,2}):(\d{2}) (am|pm) (\w+)/i;
    const match = dateString.match(dateRegex);

    if (!match) {
        return null;
    }

    const [, month, day, year, hours, minutes, ampm, timeZone] = match;
    const isPM = ampm.toLowerCase() === 'pm';

    const months: { [key: string]: number } = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    const monthIndex = months[month.toLowerCase()];
    if (monthIndex === undefined) {
        return null;
    }

    let hours24 = parseInt(hours, 10);
    if (isPM && hours24 !== 12) {
        hours24 += 12;
    } else if (!isPM && hours24 === 12) {
        hours24 = 0;
    }

    const date = new Date();
    date.setFullYear(parseInt(year, 10));
    date.setMonth(monthIndex);
    date.setDate(parseInt(day, 10));
    date.setHours(hours24);
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

export function sanitizeUrl(url: string): string {
    const urlParts = url.split('?');
    if (urlParts.length > 1) {
        return urlParts[0];
    }
    return url;
}

export function parseDqlFileName(filename: string): { domain: string, country: string, language: string } | null {
    const regex = /^([a-zA-Z.]+)_([a-zA-Z]+)_([a-zA-Z]+)\.dql$/;
    const match = filename.match(regex);

    if (!match) {
        return null;
    }

    const [, domain, language, country] = match;

    return {
        domain,
        country,
        language
    };
}
