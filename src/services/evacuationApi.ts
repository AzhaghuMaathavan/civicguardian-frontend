import { api } from '../store/api';

export const evacuationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShelters: builder.query({
      query: () => '/shelters',
      transformResponse: (response: any) => {
        if (response && Array.isArray(response.content)) {
          return response.content.map((s: any) => ({
            id: s.id,
            name: s.shelterName || s.name,
            capacity: s.maximumCapacity || s.capacity,
            currentOccupancy: s.currentOccupancy,
            status: s.shelterStatus || s.status,
            supplies: s.availableBeds > 50 ? 'Sufficient' : 'Low',
            location: s.address || s.location,
            latitude: s.location?.latitude || s.latitude,
            longitude: s.location?.longitude || s.longitude
          }));
        }
        if (Array.isArray(response) && response.length > 0) return response;
        return [];
      },
    }),
    getRoutes: builder.query({
      query: () => '/evacuation-routes',
      transformResponse: (response: any) => {
        if (response && Array.isArray(response.content)) {
          return response.content.map((r: any) => ({
            id: r.id,
            name: r.routeName || r.name || `Route ${r.id.toString().substring(0,6)}`,
            status: r.routeStatus || r.status || 'Clear',
            estimatedTime: `${r.estimatedTimeMinutes || 15} mins`
          }));
        }
        if (Array.isArray(response) && response.length > 0) return response;
        return [];
      },
    }),
    createShelter: builder.mutation({
      query: (body) => ({
        url: '/shelters',
        method: 'POST',
        body,
      }),
    }),
  }),
});
export const { useGetSheltersQuery, useGetRoutesQuery, useCreateShelterMutation } = evacuationApi;
