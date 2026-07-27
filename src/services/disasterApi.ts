import { api } from '../store/api';

export const disasterApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAlerts: builder.query({
      query: () => '/disasters/active',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        }
        if (!list || list.length === 0) return [];
        return list.map((item: any) => ({
          ...item,
          id: String(item.id || item.disasterId || ''),
          severity: item.severity === 'CRITICAL' || item.severity === 'EXTREME' ? 'Critical' : item.severity === 'HIGH' ? 'Warning' : 'Info',
          message: item.title || item.type || '',
          time: item.startTime ? new Date(item.startTime + (item.startTime.includes('Z') ? '' : 'Z')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        }));
      },
    }),
    getDisasters: builder.query({
      query: () => '/disasters',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        }
        if (!list || list.length === 0) return [];
        return list.map((item: any) => ({
          ...item,
          id: String(item.id || item.disasterId || ''),
          type: item.type || '',
          name: item.title || item.type || '',
          location: item.location ? `${item.location.city || item.location.address || ''}` : '',
          latitude: item.location?.latitude || item.latitude,
          longitude: item.location?.longitude || item.longitude,
          status: item.status || ''
        }));
      },
    }),
    getActiveDisasters: builder.query({
      query: () => '/disasters/active',
      transformResponse: (response: any) => {
        let list = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && Array.isArray(response.content)) {
          list = response.content;
        }
        return list;
      },
    }),
  }),
});
export const { useGetAlertsQuery, useGetDisastersQuery, useGetActiveDisastersQuery } = disasterApi;
