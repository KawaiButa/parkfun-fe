import dayjs, { Dayjs } from "dayjs";
import _, { ObjectIterateeCustom } from "lodash";

const filterAndSearch = <T>(props: {
  data: T[];
  searchParam: string;
  searchField: string;
  filter: ObjectIterateeCustom<T, boolean>;
}) => {
  const { data, searchParam, searchField, filter } = props;
  const filteredData = _.filter(data, filter) as T[];
  if (searchParam == "") return filteredData;
  const searchedData = filteredData?.filter((obj) => ("" + _.get(obj, searchField)).includes(searchParam));
  return searchedData;
};
const validateEmptyString = (value: string) => (value.length === 0 ? null : value);
const timeToSeconds = (time: Dayjs) => {
  const hours = time.hour();
  const minutes = time.minute();
  const seconds = time.second();
  return hours * 3600 + minutes * 60 + seconds;
};

function getNearestRoundTime(date: Dayjs, interval: number = 15): Dayjs {
  const minutes = date.minute();
  const roundedMinutes = Math.round(minutes / interval) * interval;
  
  return date.startOf('hour').add(roundedMinutes, 'minute');
}

function secondToDayTime(seconds: number): Dayjs {
  const midnight = dayjs().startOf('day');
  const time = midnight.add(seconds,"second");
  return time;
}

const getDuration = (startAt: number, endAt: number) => {
  if(startAt < endAt) return endAt - startAt;
  return 86400 - (startAt - endAt); 
}
export { validateEmptyString, getDuration, timeToSeconds, filterAndSearch, getNearestRoundTime, secondToDayTime};
