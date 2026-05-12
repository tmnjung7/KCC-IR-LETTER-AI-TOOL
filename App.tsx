import React, { useState, useEffect } from 'react';
import { getInitialStateKor } from './constants';
import { IRLetterState } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { FileDown, LayoutDashboard, Settings, Languages, Loader2, Save, History, X, Trash2, GripVertical } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface SavedDraft {
  id: string;
  date: string;
  title: string;
  data: IRLetterState;
}

const App: React.FC = () => {
  const [data, setData] = useState<IRLetterState>(getInitialStateKor());
  const [lang, setLang] = useState<'KOR' | 'ENG'>('KOR');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    const saved = localStorage.getItem('ir-letter-drafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editorWidth, setEditorWidth] = useState(500);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('ir-letter-drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      if (newWidth < 350) newWidth = 350;
      if (newWidth > 800) newWidth = 800;
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleSaveDraft = () => {
    const newDraft: SavedDraft = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR'),
      title: data.quarterTitle || '제목 없음',
      data: JSON.parse(JSON.stringify(data))
    };
    setSavedDrafts(prev => [newDraft, ...prev].slice(0, 10));
    alert('현재 내용이 임시저장되었습니다.');
  };

  const handleUpdateData = <K extends keyof IRLetterState,>(key: K, value: IRLetterState[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const getApiKey = () => {
    const key = process.env.GEMINI_API_KEY || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);
    if (key) return key;
    return localStorage.getItem('USER_GEMINI_API_KEY') || null;
  };

  const translateToEnglish = async () => {
    if (lang === 'ENG') return;
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("Gemini API Key가 설정되지 않았습니다. AI 자동작성 기능을 먼저 사용하여 API Key를 입력해주세요.");
      return;
    }
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
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
          
          <div className="flex items-center gap-2 mr-2">
            <button onClick={handleSaveDraft} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <Save className="w-4 h-4" /> 임시저장
            </button>
            <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <History className="w-4 h-4" /> 최근 내역
            </button>
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
        <div 
          style={{ width: `${editorWidth}px`, minWidth: `${editorWidth}px` }} 
          className="border-r border-slate-200 bg-white overflow-y-auto no-print shadow-sm z-10 flex-shrink-0"
        >
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

        {/* Resizer Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className={`w-2 bg-slate-100 hover:bg-blue-400 cursor-col-resize flex items-center justify-center border-r border-slate-200 z-20 transition-colors ${isDragging ? 'bg-blue-400' : ''}`}
          title="드래그하여 크기 조절"
        >
          <GripVertical className="w-3 h-4 text-slate-400" />
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#002B5B]" />
                <h3 className="text-lg font-black text-[#002B5B]">최근 작성 내역</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {savedDrafts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Save className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold">저장된 내역이 없습니다.</p>
                  <p className="text-xs mt-1">상단의 '임시저장' 버튼을 눌러 현재 상태를 저장해보세요.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedDrafts.map(draft => (
                    <div key={draft.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:border-blue-300 transition-colors bg-slate-50 hover:bg-white">
                      <div>
                        <div className="font-bold text-sm text-slate-800 mb-1">{draft.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{draft.date}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setData(draft.data); setShowHistoryModal(false); }} 
                          className="px-4 py-2 bg-[#002B5B] text-white text-xs font-bold rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                        >
                          불러오기
                        </button>
                        <button 
                          onClick={() => setSavedDrafts(prev => prev.filter(d => d.id !== draft.id))} 
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
