
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
    earningsSummary: [
      "(매출액) YoY -0.7%, QoQ -4.8%",
      "(영업이익) YoY -6.4% QoQ -16.5%",
      "- 경기위축 및 하절기(여름휴가철 등) 계절적 영향으로 인한 물량 감소",
      "(당기순이익) 3,263억원",
      "- 보유 금융자산 주가 상승에 따른 효과",
      "- QoQ MPM 이자비용 절감(약 180억 이상)"
    ],
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
      {
        title: "분기 실적 요약",
        subtitle: "계절적·일회성 요인 제외 시 견조한 흐름",
        details: [
          "(건재사업부) 전방산업의 침체 속 수익성 방어 노력 지속",
          "(도료사업부) 자동차·선박 중심으로 매출액 및 수익성 유지",
          "(실리콘사업부) 하절기 전방산업 약세 영향 있었으나, 공장 효율화 및 비용 절감 노력을 지속하며 수익성 개선 기반 마련"
        ]
      },
      {
        title: "재무구조 안정화",
        subtitle: "실리콘사업부(MPM) 유동성 개선",
        details: [
          "작년말 이후 보유 예금을 통한 상환(400M$), 올해 7월 타법인 주식을 활용한 EB발행을 통한 차환(650M$) 진행 완료",
          "또한, '25년 10월 MPM 금융보증채 발행을 통한 리파이낸싱 진행 TLB 등 차입금을 통합하여 이자비용 절감",
          "현재 MPM 차입금 700M$ + α 수준으로 개선"
        ]
      },
      {
        title: "유기실리콘 동향",
        subtitle: "(시장동향) 중국 유기실리콘 기업, 감산관련",
        details: [
          "12월부터 중국 업체 중심 가동률 감축 합의 진행 이슈 발생",
          "실제로 직후 DMC 가격 +20%상승 (장기적으로 DMC 가격 상승 시, 기초 제품군 수익성 개선)",
          "다만, 그간 과잉 공급 및 변동성으로 지속적인 모니터링 필요"
        ]
      },
      {
        title: "향후 전망 및 전략",
        subtitle: "고부가가치 제품 확대 및 수익성 중심 경영",
        details: [
          "친환경 및 고기능성 신제품 라인업 확대를 통한 시장 지배력 강화",
          "글로벌 네트워크를 활용한 해외 매출 비중 지속 확대 추진",
          "원가 절감 및 생산 공정 효율화로 대외 불확실성 대비 수익성 방어"
        ]
      }
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
