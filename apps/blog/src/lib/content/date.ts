import dayjs, { type Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import "dayjs/locale/ja";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const dateNow = () => dayjs().tz("Asia/Tokyo");

export const parseDate = (date: string) => {
  return dayjs(date, "Asia/Tokyo");
};

export const formatDate = (date: Dayjs) => {
  return date.locale("ja").format("L");
};
