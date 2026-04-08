
import React, { useState } from 'react';
import { IRLetterState, BusinessHighlight, PerformanceData, IndicatorData } from '../types';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface EditorProps {
  data: IRLetterState;
  onUpdate: <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  const [activeAIIndex, setActiveAIIndex] = useState<number | null>(null);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState<BusinessHighlight | null>(null);

  const updateHighlight = (index: number, field: keyof BusinessHighlight, value: string | string[]) => {
    const newHighlights = [...data.businessHighlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    onUpdate('businessHighlights', newHighlights);
  };

  const updatePerformance = (index: number, field: keyof PerformanceData, value: string | number) => {
    const newData = [...data.performanceHistory];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate('performanceHistory', newData);
  };

  const updateIndicator = (index: number, field: keyof IndicatorData, value: string | number) => {
    const newData = [...data.indicatorHistory];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate('indicatorHistory', newData);
  };

  const handleGenerateAI = async (index: number) => {
    setIsGenerating(true);
    setAiDraft(null);
    const targetHighlight = data.businessHighlights[index];
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
      다음은 KCC IR 레터의 '${targetHighlight.title}' 섹션에 대한 키워드입니다.
      이 키워드들을 바탕으로 투자자들에게 신뢰감을 줄 수 있는 전문적인 IR 문구를 작성해주세요.
      
      [섹션 제목]
      ${targetHighlight.title}
      
      [사용자 입력 키워드]
      ${aiKeywords || '최근 시장 동향 및 대응 전략'}
      
      [작성 가이드]
      1. 전문적인 금융/IR 용어를 사용하세요.
      2. 문장은 간결하면서도 핵심 내용을 포함해야 합니다.
      3. 소제목(subtitle)은 해당 섹션의 핵심 요약을 1줄로 작성하세요.
      4. 세부 내용(details)은 2~3개의 불렛 포인트로 작성하세요.
      
      반드시 아래 JSON 형식으로만 응답해주세요:
      {
        "title": "${targetHighlight.title}",
        "subtitle": "섹션의 핵심 요약 문구",
        "details": [
          "첫 번째 세부 성과 또는 동향...",
          "두 번째 세부 성과 또는 동향...",
          "세 번째 세부 성과 또는 동향(선택 사항)..."
        ]
      }
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text;
      if (!responseText) throw new Error("AI 응답이 비어있습니다.");

      const result = JSON.parse(responseText);
      setAiDraft({
        title: result.title || targetHighlight.title,
        subtitle: result.subtitle || "",
        details: result.details || []
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("AI 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyDraft = (index: number) => {
    if (!aiDraft) return;
    const newHighlights = [...data.businessHighlights];
    newHighlights[index] = { 
      ...newHighlights[index], 
      subtitle: aiDraft.subtitle,
      details: aiDraft.details
    };
    onUpdate('businessHighlights', newHighlights);
    setAiDraft(null);
    setActiveAIIndex(null);
    setAiKeywords('');
  };

  const sectionHeader = (title: string) => (
    <h3 className="font-black text-[#002B5B] text-lg flex items-center gap-2 mb-4">
      <div className="w-1.5 h-6 bg-[#002B5B] rounded-full"></div>
      {title}
    </h3>
  );

  return (
    <div className="space-y-12 pb-20">
      <section>
        {sectionHeader("기본 정보")}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">발행 일자</label>
            <input className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium" value={data.date} onChange={e => onUpdate('date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">분기 제목</label>
            <input className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-medium" value={data.quarterTitle} onChange={e => onUpdate('quarterTitle', e.target.value)} />
          </div>
        </div>
      </section>

      <section>
        {sectionHeader("실적 요약 (Earnings Summary)")}
        <textarea 
          className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[160px] leading-relaxed font-medium" 
          value={data.earningsSummary.join('\n')} 
          onChange={e => onUpdate('earningsSummary', e.target.value.split('\n'))}
        />
      </section>

      <section>
        {sectionHeader("분기별 실적 데이터")}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-3 max-h-[300px] overflow-y-auto border-2 border-gray-100">
          <div className="grid grid-cols-4 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center px-2">
            <div>분기</div>
            <div>매출액</div>
            <div>영업이익</div>
            <div>이익률(%)</div>
          </div>
          {data.performanceHistory.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
              <input className="border text-xs p-1 rounded font-bold" value={item.quarter} onChange={e => updatePerformance(idx, 'quarter', e.target.value)} />
              <input type="number" className="border text-xs p-1 rounded text-center" value={item.revenue} onChange={e => updatePerformance(idx, 'revenue', Number(e.target.value))} />
              <input type="number" className="border text-xs p-1 rounded text-center" value={item.operatingProfit} onChange={e => updatePerformance(idx, 'operatingProfit', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.profitRate} onChange={e => updatePerformance(idx, 'profitRate', Number(e.target.value))} />
            </div>
          ))}
        </div>
      </section>

      <section>
        {sectionHeader("사업별 주요 성과")}

        {data.businessHighlights.map((highlight, idx) => (
          <div key={idx} className="p-6 border-2 border-gray-100 rounded-2xl bg-white mb-6 space-y-4 shadow-sm hover:border-blue-100 transition-colors">
            <div className="flex items-center justify-between border-b pb-2">
              <input className="font-black text-base text-[#002B5B] outline-none w-full" value={highlight.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} />
              <button
                onClick={() => {
                  if (activeAIIndex === idx) {
                    setActiveAIIndex(null);
                    setAiDraft(null);
                  } else {
                    setActiveAIIndex(idx);
                    setAiDraft(null);
                    setAiKeywords('');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ml-4 ${activeAIIndex === idx ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI 자동 작성
              </button>
            </div>

            {activeAIIndex === idx && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-inner">
                <h4 className="text-xs font-black text-[#002B5B] mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  '{highlight.title}' AI 생성 키워드
                </h4>
                <div className="space-y-3 mb-4">
                  <textarea 
                    className="w-full border border-blue-200 rounded-lg p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none min-h-[60px]" 
                    placeholder="해당 섹션의 핵심 성과나 동향 키워드를 입력하세요 (예: 수익성 방어, 시장 점유율 확대, 비용 절감 등)"
                    value={aiKeywords}
                    onChange={e => setAiKeywords(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => {
                      setActiveAIIndex(null);
                      setAiDraft(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    onClick={() => handleGenerateAI(idx)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-[#002B5B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {isGenerating ? '생성 중...' : 'AI 생성하기'}
                  </button>
                </div>

                {aiDraft && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-2 mb-4">
                      <div className="text-sm font-extrabold text-slate-900">{aiDraft.subtitle}</div>
                      <ul className="space-y-1">
                        {aiDraft.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-xs text-slate-600 font-medium flex gap-2">
                            <span className="text-blue-400 font-bold shrink-0">·</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => applyDraft(idx)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                      >
                        이 초안으로 적용하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">소제목 (Subtitle)</label>
                <input className="w-full italic text-sm text-[#002B5B] bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium" value={highlight.subtitle} onChange={e => updateHighlight(idx, 'subtitle', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">세부 내용 (Details - 줄바꿈으로 구분)</label>
                <textarea className="w-full text-xs border-2 border-slate-50 rounded-xl p-4 min-h-[100px] leading-relaxed font-medium focus:border-blue-100 outline-none" value={highlight.details.join('\n')} onChange={e => updateHighlight(idx, 'details', e.target.value.split('\n'))} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section>
        {sectionHeader("재무 건전성 지표 (Key Indicators)")}
        <div className="bg-gray-50 p-4 rounded-2xl space-y-3 max-h-[300px] overflow-y-auto border-2 border-gray-100">
          <div className="grid grid-cols-5 gap-2 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center px-2">
            <div>분기</div>
            <div>유동비율(%)</div>
            <div>자기자본(%)</div>
            <div>의존도(%)</div>
            <div>부채비율(%)</div>
          </div>
          {data.indicatorHistory.map((item, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
              <input className="border text-xs p-1 rounded font-bold text-center" value={item.quarter} onChange={e => updateIndicator(idx, 'quarter', e.target.value)} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.liquidityRatio} onChange={e => updateIndicator(idx, 'liquidityRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.equityRatio} onChange={e => updateIndicator(idx, 'equityRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.dependencyRatio} onChange={e => updateIndicator(idx, 'dependencyRatio', Number(e.target.value))} />
              <input type="number" step="0.1" className="border text-xs p-1 rounded text-center" value={item.debtRatio} onChange={e => updateIndicator(idx, 'debtRatio', Number(e.target.value))} />
            </div>
          ))}
        </div>
      </section>

      <section>
        {sectionHeader("IR 활동 및 지원")}
        <div className="space-y-4">
          <textarea 
            className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[100px]" 
            value={data.irSupport.join('\n')} 
            onChange={e => onUpdate('irSupport', e.target.value.split('\n'))}
          />
          <textarea 
            className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm min-h-[150px]" 
            value={data.irAction.join('\n')} 
            onChange={e => onUpdate('irAction', e.target.value.split('\n'))}
          />
        </div>
      </section>
    </div>
  );
};

export default Editor;
