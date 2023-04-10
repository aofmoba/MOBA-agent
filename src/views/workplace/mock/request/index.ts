import axios from 'axios';
import type { ContentDataRecord, PopularRecord } from '@/views/workplace/type';

export function queryContentData() {
  return axios
    .get<{ data: ContentDataRecord[] }>('/api/mock/content-data')
    .then((res) => res.data);
}

export function queryPopularList(params: { type: string }) {
  return axios
    .get<{ data: PopularRecord[] }>('/api/mock/popular/list', { params })
    .then((res) => res.data);
}
