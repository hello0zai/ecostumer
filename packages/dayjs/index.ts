import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

export function setDayjsLocale(locale: string) {
  import(`dayjs/locale/${locale}`).then(() => {
    dayjs.locale(locale);
  }).catch(err => {
    console.error(`Erro ao definir a localidade: ${err.message}`);
  });
}

export { dayjs };
