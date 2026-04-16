
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
    performanceHistory: [
      { quarter: "'24 1Q", revenue: 15884, operatingProfit: 1069, profitRate: 6.7 },
      { quarter: "'24 2Q", revenue: 17787, operatingProfit: 1406, profitRate: 7.9 },
      { quarter: "'24 3Q", revenue: 16342, operatingProfit: 1253, profitRate: 7.7 },
      { quarter: "'24 4Q", revenue: 16575, operatingProfit: 983, profitRate: 5.9 },
      { quarter: "'25 1Q", revenue: 15993, operatingProfit: 1034, profitRate: 6.5 },
      { quarter: "'25 2Q", revenue: 17053, operatingProfit: 1404, profitRate: 8.2 },
      { quarter: "'25 3Q", revenue: 16228, operatingProfit: 1173, profitRate: 7.2 }
    ],
    businessHighlights: [
      { title: "분기 실적 요약", subtitle: "", details: [] },
      { title: "부문별 주요이슈", subtitle: "", details: [] },
      { title: "유기실리콘 동향", subtitle: "", details: [] },
      { title: "향후 전망 및 전략", subtitle: "", details: [] }
    ],
    indicatorHistory: [
      { quarter: "2024 3Q", liquidityRatio: 131.3, equityRatio: 37.9, dependencyRatio: 40.8, debtRatio: 164.2 },
      { quarter: "2024 4Q", liquidityRatio: 123.6, equityRatio: 38.4, dependencyRatio: 39.6, debtRatio: 160.1 },
      { quarter: "2025 1Q", liquidityRatio: 136.7, equityRatio: 37.4, dependencyRatio: 41.6, debtRatio: 140.7 },
      { quarter: "2025 2Q", liquidityRatio: 120.5, equityRatio: 33.5, dependencyRatio: 45.3, debtRatio: 130.6 },
      { quarter: "2025 3Q", liquidityRatio: 98.4, equityRatio: 31.2, dependencyRatio: 46.0, debtRatio: 117.6 }
    ],
    irSupport: [
      "IR 전용회선 ☎ 02-3480-5000 (교환 5)",
      "IR 전용 페이지 (kccworld.irpage.co.kr)",
      "IR 미팅 예약·Q&A 섹션 활용 가능",
      "IR 정보 통합 제공, 접근성 향상"
    ],
    irAction: [
      "해외 기관투자자 미팅 확대 ('24년 평균 2회/月 → '25년 평균 4회/月)",
      "연기금 IR 미팅 정례화 (연 1회이상)",
      "애널리스트 커버리지 확대 ('24년 4명 → '25년 8명)",
      "'25년도 IR 활동 관련 예정사항 (12월)",
      "- KCC IR BOOK(2024-25) 영문본 발간",
      "- 기업가치제고계획(2025) 영문본 발간",
      "- 기관투자자 대상 2025 IR 설문조사 진행",
      "- 그 외 IR Activities 다양화를 통한 투자자 접점 확대"
    ]
  };
};
