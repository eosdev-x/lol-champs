export function riotHtmlToText(value: string): string {
  const withLineBreaks = value
    .replace(/<br\s*\/?>/giu, '\n')
    .replace(/<\/(p|li)>/giu, '\n');

  if (typeof DOMParser === 'undefined') {
    return withLineBreaks.replace(/<[^>]*>/gu, '').trim();
  }

  const document = new DOMParser().parseFromString(withLineBreaks, 'text/html');
  return (document.body.textContent ?? '').replace(/\n{3,}/gu, '\n\n').trim();
}
