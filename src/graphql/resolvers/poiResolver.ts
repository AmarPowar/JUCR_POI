export const poiResolver = {
    Query: {
      getPOIs: async (_parent: any, _args: any, { db }: any) => {
        try {
          return await db.PointOfInterest.find({});
        } catch (error) {
          throw new Error('Failed to fetch Points of Interest.');
        }
      },
    },
  };
  