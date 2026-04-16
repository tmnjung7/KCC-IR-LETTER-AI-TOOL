
import { IRLetterState } from './types';

export const getInitialStateKor = (): IRLetterState => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const dayName = days[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();
  
  const formattedDate = `${dayName} ${day} ${monthName}, ${year}`;
  
  const currentMonth = now.getMonth();
  let prevQuarterYear = year;
  let prevQuarter = 1;
  
  if (currentMonth >= 0 && currentMonth <= 2) {
    prevQuarterYear -= 1;
    prevQuarter = 4;
  } else if (currentMonth >= 3 && currentMonth <= 5) {
    prevQuarter = 1;
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    prevQuarter = 2;
  } else {
    prevQuarter = 3;
  }
  
  const formattedQuarter = `${prevQuarterYear}년 ${prevQuarter}분기`;

  return {
    date: formattedDate,
    quarterTitle: formattedQuarter,
    earningsSummary: [],
    performanceHistory: [],
    businessHighlights: [
      { title: "분기 실적 요약", subtitle: "", details: [] },
      { title: "재무구조 안정화", subtitle: "", details: [] },
      { title: "유기실리콘 동향", subtitle: "", details: [] },
      { title: "향후 전망 및 전략", subtitle: "", details: [] }
    ],
    indicatorHistory: [],
    irSupport: [],
    irAction: []
  };
};
