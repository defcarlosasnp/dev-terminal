export const checkServiceStatus = async (services) => {
  const results = await Promise.all(services.map(async (service) => {
    const start = Date.now();
    try {
      await fetch(service.url, { 
        mode: 'no-cors', 
        cache: 'no-store',
        credentials: 'omit'
      });
      
      return {
        name: service.name,
        status: 'ONLINE',
        latency: Date.now() - start + 'ms'
      };
    } catch (e) {
      return {
        name: service.name,
        status: 'OFFLINE',
        latency: '---'
      };
    }
  }));
  return results;
};