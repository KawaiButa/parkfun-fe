import _, { ObjectIterateeCustom } from "lodash";

const validateEmptyString = (value: string) => (value.length === 0 ? null : value);

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
export { validateEmptyString, filterAndSearch };
