import React from 'react';
import { IRLetterState } from '../types';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Line, ComposedChart, LabelList, Legend, LineChart
} from 'recharts';
import { Phone, Globe, Mail, MapPin } from 'lucide-react';

interface PreviewProps {
  data: IRLetterState;
}

const Page = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-[210mm] h-[297mm] bg-white p-[20mm] shadow-none font-sans flex flex-col select-none cursor-default relative overflow-hidden page ${className}`}>
    {/* Decorative Accent */}
    <div className="absolute top-0 left-0 w-full h-2 bg-[#002B5B]"></div>
    {children}
  </div>
);

const Preview: React.FC<PreviewProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-6 print:gap-0">
      {/* Page 1 */}
      <Page>
        {/* Header Section */}
        <div className="flex justify-between items-end border-b-[3px] border-[#002B5B] pb-4 mb-6">
          <div className="flex flex-col">
            <span className="text-[#002B5B] text-sm font-bold tracking-[0.3em] mb-1">{data.date}</span>
            <h1 className="text-[#002B5B] text-[72px] font-[900] italic tracking-[-0.05em] leading-[0.8]">IR LETTER</h1>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black text-[#002B5B] tracking-tight">(주) KCC</span>
             </div>
             <div className="text-3xl font-bold text-gray-500 tracking-tight">{data.quarterTitle}</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Performance Chart Section */}
          <div className="col-span-7 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#002B5B]"></div>
              <h2 className="text-lg font-extrabold text-[#002B5B]">최근 분기별 실적 추이 <span className="text-[10px] font-medium text-gray-400 ml-2">(단위: 억원, %)</span></h2>
            </div>
            <div className="h-[220px] bg-[#f8fafc] rounded-xl p-4 border border-gray-100 flex justify-center items-center">
               <ComposedChart width={380} height={220} data={data.performanceHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                 <YAxis yAxisId="left" hide />
                 <YAxis yAxisId="right" orientation="right" hide />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    cursor={{ fill: '#f1f5f9' }}
                 />
                 <Bar 
                   yAxisId="left" 
                   dataKey="revenue" 
                   fill="#3b82f6" 
                   barSize={32} 
                   radius={[4, 4, 0, 0]}
                   isAnimationActive={false}
                 >
                   <LabelList dataKey="revenue" position="top" style={{ fontSize: 9, fill: '#3b82f6', fontWeight: 800 }} formatter={(v: number) => v.toLocaleString()} />
                 </Bar>
                 <Bar 
                   yAxisId="left" 
                   dataKey="operatingProfit" 
                   fill="#1e293b" 
                   barSize={24} 
                   radius={[4, 4, 0, 0]}
                   isAnimationActive={false}
                 >
                    <LabelList dataKey="operatingProfit" position="top" style={{ fontSize: 8, fill: '#1e293b', fontWeight: 700 }} />
                 </Bar>
                 <Line 
                   yAxisId="right" 
                   type="monotone" 
                   dataKey="profitRate" 
                   stroke="#f59e0b" 
                   strokeWidth={3} 
                   dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                   isAnimationActive={false}
                 >
                   <LabelList dataKey="profitRate" position="top" offset={8} style={{ fontSize: 10, fill: '#d97706', fontWeight: 800 }} formatter={(v: number) => `${v}%`} />
                 </Line>
                 <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '10px' }} />
               </ComposedChart>
            </div>
          </div>

          {/* Earnings Summary Section */}
          <div className="col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#002B5B]"></div>
              <h2 className="text-lg font-extrabold text-[#002B5B]">EARNINGS SUMMARY</h2>
            </div>
            <div className="flex-1 bg-white border-2 border-gray-50 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#002B5B]/5 rounded-bl-full"></div>
              <ul className="space-y-2.5">
                {data.earningsSummary.map((line, idx) => {
                  const isSubItem = line.startsWith('-');
                  return (
                    <li key={idx} className={`leading-snug ${isSubItem ? 'ml-4 text-[11px] text-gray-500 font-medium italic' : 'text-[13px] font-bold text-slate-800 flex items-start gap-2'}`}>
                      {!isSubItem && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>}
                      <span>{line.replace(/^- /, '')}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <h2 className="text-xl font-black italic tracking-tight text-[#002B5B]">BUSINESS HIGHLIGHTS</h2>
              <div className="h-1 flex-1 mx-4 bg-gray-50"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.businessHighlights.map((bh, idx) => (
              <div key={idx} className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-100 flex flex-col transition-all hover:shadow-md h-full">
                <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1 break-keep">{bh.title}</div>
                <div className="text-[13px] font-extrabold text-slate-900 leading-snug mb-2 break-keep">
                  {bh.subtitle}
                </div>
                <div className="w-6 h-1 bg-blue-500 mb-3"></div>
                <ul className="space-y-1.5 flex-1">
                  {bh.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-[11px] leading-relaxed text-slate-600 font-medium flex gap-1.5 break-keep">
                      <span className="text-blue-400 font-bold shrink-0">·</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Page>

      {/* Page 2 */}
      <Page>
        <div className="flex flex-col h-full">
          {/* Key Indicators Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-[#002B5B]"></div>
              <h2 className="text-lg font-extrabold text-[#002B5B]">KEY INDICATORS <span className="text-[10px] font-medium text-gray-400 ml-2">(재무 건전성 지표)</span></h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-[280px] flex justify-center items-center">
                  <LineChart width={640} height={280} data={data.indicatorHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#cbd5e1' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                    <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ fontSize: '9px', fontWeight: 700, paddingBottom: '10px' }} />
                    <Line type="monotone" dataKey="liquidityRatio" name="유동비율" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="debtRatio" name="부채비율" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="equityRatio" name="자기자본" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} isAnimationActive={false} />
                  </LineChart>
            </div>
          </div>

          {/* IR Contact Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-[#002B5B]"></div>
              <h2 className="text-lg font-extrabold text-[#002B5B]">IR CONTACT</h2>
            </div>
            <div className="bg-[#1e293b] text-white rounded-2xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[200px]">
               <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full"></div>
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="bg-blue-500/20 p-2 rounded-lg"><Phone className="w-5 h-5 text-blue-400" /></div>
                     <span className="text-sm font-bold">02-3480-5000 (교환 5)</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="bg-blue-500/20 p-2 rounded-lg"><Globe className="w-5 h-5 text-blue-400" /></div>
                     <span className="text-sm font-bold">kccworld.irpage.co.kr</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="bg-blue-500/20 p-2 rounded-lg"><Mail className="w-5 h-5 text-blue-400" /></div>
                     <span className="text-sm font-bold">ir@kccworld.co.kr</span>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    본 자료는 투자자의 이해를 돕기 위해 작성되었습니다. 자세한 내용은 공식 IR 홈페이지를 참고하시기 바랍니다.
                  </p>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center border-t-2 border-gray-100 pt-8 text-[#002B5B]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-[11px] font-bold">서울특별시 서초구 사평대로 344 (주)KCC</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[13px] font-black tracking-tighter">KCC INVESTOR RELATIONS</span>
              <div className="bg-[#002B5B] text-white px-3 py-1 rounded text-[10px] font-black italic">TRUST KCC</div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
};

export default Preview;