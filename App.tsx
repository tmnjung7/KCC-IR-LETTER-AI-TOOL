import React, { useState } from 'react';
import { getInitialStateKor } from './constants';
import { IRLetterState } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { FileDown, LayoutDashboard, Settings, Languages, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<IRLetterState>(getInitialStateKor());
  const [lang, setLang] = useState<'KOR' | 'ENG'>('KOR');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleUpdateData = <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const translateToEnglish = async () => {
    if (lang === 'ENG') return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following IR Letter JSON data from Korean to English. 
        Maintain professional financial and Investor Relations terminology. 
        Keep the structure of 'performanceHistory' and 'indicatorHistory' intact.
        Return ONLY the raw JSON object.
        Data: ${JSON.stringify(data)}`,
        config: {
          responseMimeType: "application/json",
        },
      });
      
      const translatedData = JSON.parse(response.text || '{}');
      setData(translatedData);
      setLang('ENG');
    } catch (error) {
      console.error("AI Translation Error:", error);
      alert("AI 번역 중 오류가 발생했습니다. API 키 설정을 확인하거나 잠시 후 다시 시도해주세요.");
    } finally {
      setIsTranslating(false);
    }
  };

  const switchToKorean = () => {
    if (lang === 'KOR') return;
    setLang('KOR');
    setData(getInitialStateKor());
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 text-slate-800 p-4 shadow-sm flex items-center justify-between no-print sticky top-0 z-50 px-8">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#002B5B] p-2 rounded-xl shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#002B5B] leading-none">KCC IR SYSTEM</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Letter Generator v1.0</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button 
              onClick={switchToKorean}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-200 ${lang === 'KOR' ? 'bg-white text-[#002B5B] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              국문 (KOR)
            </button>
            <button 
              onClick={translateToEnglish}
              disabled={isTranslating}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-2 ${lang === 'ENG' ? 'bg-white text-[#002B5B] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
              AI 영문 변환
            </button>
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#002B5B] hover:bg-slate-800 text-white transition-all transform px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95"
        >
          <FileDown className="w-4 h-4" />
          PDF 다운로드
        </button>
      </header>

      {/* Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor (Left) */}
        <div className="w-[420px] border-r border-slate-200 bg-white overflow-y-auto no-print shadow-sm z-10">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#002B5B]" />
                <h2 className="text-lg font-black text-slate-800">콘텐츠 편집</h2>
              </div>
              <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded font-bold">{lang} MODE</span>
            </div>
            {isTranslating ? (
              <div className="flex flex-col items-center justify-center py-40 text-slate-400 gap-6">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-[#002B5B] rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-base font-black text-slate-700">Gemini AI가 번역 중입니다</p>
                  <p className="text-xs mt-1 text-slate-400 font-medium">금융 전문 용어를 분석하여 최적화하고 있습니다.</p>
                </div>
              </div>
            ) : (
              <Editor data={data} onUpdate={handleUpdateData} />
            )}
          </div>
        </div>

        {/* Preview (Right) */}
        <div className="flex-1 bg-slate-100 overflow-y-auto flex justify-center p-12 scroll-smooth no-print">
          <div className="shadow-2xl bg-white relative transition-all duration-500 origin-top transform scale-[0.85] lg:scale-[0.9] xl:scale-[1.0] mb-20">
             <Preview data={data} />
          </div>
        </div>

        {/* Hidden Print Area (Off-screen to allow Recharts rendering) */}
        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none print:static print:z-auto print:opacity-100 print:block print-area">
          <Preview data={data} />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 p-3 text-center text-[10px] font-bold text-slate-400 no-print flex justify-center items-center gap-4">
        <span>&copy; 2025 (주)KCC Investor Relations System</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
        <span className="text-slate-300">Confidential Financial Report Generator</span>
      </footer>
    </div>
  );
};

export default App;