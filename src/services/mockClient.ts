const MOCK_DELAY_MS = 350;

export async function mockRequest<T>(data: T, delay = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay);
  });
}
