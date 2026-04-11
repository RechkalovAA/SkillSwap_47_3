export async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const { status } = response;
    const { statusText } = response;
    throw new Error(`Failed to fetch ${url}: ${status} ${statusText}`);
  }

  const data = await response.json();
  return data as T;
}
