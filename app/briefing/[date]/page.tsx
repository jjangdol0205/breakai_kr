import { createClient } from "../../../utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, CornerUpLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ShareButtons from "../../components/ShareButtons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
    const resolvedParams = await params;
    const supabaseServer = await createClient();
    const { data: summary } = await supabaseServer
        .from('market_summaries')
        .select('title')
        .eq('date', resolvedParams.date)
        .single();

    return {
        title: summary?.title ? `BREAKAI_KR | ${summary.title}` : "BREAKAI_KR | 일일 마켓 브리핑",
        description: "월스트리트 프랍 트레이더 시각에서 바라본 오늘의 핵심 시장 요약 및 투자 인사이트.",
    };
}

export default async function BriefingDetailPage({ params }: { params: Promise<{ date: string }> }) {
    const resolvedParams = await params;
    const supabaseServer = await createClient();

    const { data: summary, error } = await supabaseServer
        .from('market_summaries')
        .select('*')
        .eq('date', resolvedParams.date)
        .single();

    if (error || !summary) {
        return notFound();
    }

    const dateObj = new Date(summary.date);
    const formattedDate = dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    const cleanTitle = summary.title.replace(/\*\*/g, '').trim();

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-200 selection:bg-blue-500/30 font-sans pb-24">

            {/* Minimal Header */}
            <div className="bg-zinc-950 border-b border-white/10 sticky top-0 z-40 backdrop-blur-3xl bg-opacity-70">
                <div className="max-w-4xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                    <Link href="/briefing" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm tracking-widest font-mono">
                        <ArrowLeft className="w-4 h-4" /> 목록으로
                    </Link>
                    <div className="text-blue-500 font-bold font-mono tracking-widest text-xs border border-blue-500/20 bg-blue-500/10 px-3 py-1 rounded">
                        MARKET BRIEFING
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 lg:px-6 pt-12">
                {/* Article Header */}
                <header className="mb-12 border-b border-zinc-800 pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-blue-500 w-5 h-5" />
                        <span className="text-sm font-mono font-bold tracking-widest text-zinc-400 uppercase">
                            {formattedDate}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8 font-sans">
                        {cleanTitle}
                    </h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-900/30 border border-blue-800/50 flex items-center justify-center">
                                <span className="font-bold font-mono text-blue-400">AI</span>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-0.5">Written by</p>
                                <p className="text-sm text-white font-bold">오닐 매트릭스 알고리즘</p>
                            </div>
                        </div>

                        {/* Custom Share Action Placeholder */}
                        <div className="text-zinc-500 hover:text-blue-400 cursor-pointer transition-colors p-2 rounded-full hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
                            <ShareButtons title={`마켓 브리핑: ${cleanTitle}`} url={`/briefing/${summary.date}`} description={summary.content.substring(0, 100) + '...'} />
                        </div>
                    </div>
                </header>

                {/* Markdown Content rendered via ReactMarkdown */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-h2:text-blue-400 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-3 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-white prose-a:text-blue-400 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:font-medium">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary.content}
                    </ReactMarkdown>
                </article>

                {/* Footer Navigation Back */}
                <div className="mt-20 pt-8 border-t border-zinc-800 flex justify-start">
                    <Link href="/briefing" className="inline-flex items-center justify-center bg-[#111] border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg text-sm font-mono tracking-widest uppercase gap-3">
                        <CornerUpLeft className="w-5 h-5" /> 모든 브리핑 보기
                    </Link>
                </div>
            </main>
        </div>
    );
}
