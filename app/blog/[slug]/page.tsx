import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContentLocker from '../../components/ContentLocker';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
    
    if (!fs.existsSync(filePath)) return { title: 'Post Not Found | Breakout AI' };
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const titleMatch = fileContent.match(/title:\s*"(.*?)"/);
    const descMatch = fileContent.match(/description:\s*"(.*?)"/);
    
    const title = titleMatch ? `${titleMatch[1]} | Breakout AI Insight` : '투자 교육 | Breakout AI';
    const description = descMatch ? descMatch[1] : '';
    
    return { title, description };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">포스트를 찾을 수 없습니다</h2>
                <Link href="/blog" className="text-blue-500 hover:underline">목록으로 돌아가기</Link>
            </div>
        );
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const parts = fileContent.split('---');
    let markdown = fileContent;
    let title = slug;
    let date = "";
    
    if (parts.length >= 3) {
        const frontmatter = parts[1];
        markdown = parts.slice(2).join('---').trim();
        
        const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
        if (titleMatch) title = titleMatch[1];
        
        const dateMatch = frontmatter.match(/date:\s*"(.*?)"/);
        if (dateMatch) date = dateMatch[1];
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8 mb-20 font-sans">
            <Link href="/blog" className="flex items-center text-zinc-400 hover:text-white transition group w-max font-bold text-sm tracking-wide">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                인사이트 목록으로 돌아가기
            </Link>

            <header className="border-b border-[#333] pb-8 pt-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
                    {title}
                </h1>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">AI Research</span>
                    <span className="text-zinc-500 text-sm font-bold tracking-wide">{date}</span>
                </div>
            </header>
            
            <ContentLocker>
                <div className="bg-[#0a0a0c] rounded-3xl border border-zinc-800 p-8 md:p-12 shadow-2xl">
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:mt-12 prose-headings:font-black prose-headings:text-white prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-loose prose-p:text-zinc-300 prose-p:font-medium prose-strong:text-blue-400 prose-a:text-red-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </ContentLocker>
        </div>
    );
}
