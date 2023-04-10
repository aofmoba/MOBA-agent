import dayjs from 'dayjs';

const I18nDataFormat = (timestamp: number, format?: string) =>
  dayjs(timestamp).format(format || 'M/D/YYYY,h:mm:ss A');

export default I18nDataFormat;
