const retryRequest = async <T>(fn: () => Promise<T>, retries: number = 3): Promise<any> => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed: ${error}`);
        if (attempt >= retries) throw new Error(`Failed after ${retries} retries`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay before retry
      }
    }
  };
  
  export { retryRequest };
  