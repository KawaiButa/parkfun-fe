import { Dayjs } from "dayjs";
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

export { validateEmptyString, timeToSeconds, filterAndSearch };
