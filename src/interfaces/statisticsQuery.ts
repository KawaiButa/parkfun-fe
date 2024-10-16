export enum Period {
  DAY="day",
  WEEK="week",
  MONTH="month",
  YEAR="year",
} 

export interface StatisticsQuery {
  period: Period,
  
  startAt?: number,

  endAt?: number
}