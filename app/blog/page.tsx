import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "BREAKAI_KR | 투자 인사이트 블로그",
    description: "AI와 검색 트렌드가 결합된 주식 투자 및 매매 기법 교육 자료입니다.",
};

export default function BlogList() {
    const blogDir = path.join(process.cwd(), 'content/blog');
    let posts = [];
    
    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir);
        posts = files.filter((f: string) => f.endsWith('.md')).map((filename: string) => {
            const content = fs.readFileSync(path.join(blogDir, filename), 'utf8');
            const titleMatch = content.match(/title:\s*"(.*?)"/);
            const dateMatch = content.match(/date:\s*"(.*?)"/);
            const descMatch = content.match(/description:\s*"(.*?)"/);
            
            return {
                slug: filename.replace('.md', ''),
                title: titleMatch ? titleMatch[1] : filename,
                date: dateMatch ? dateMatch[1] : 'Unknown',
                description: descMatch ? descMatch[1] : ''
            };
        }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-slate-200 font-sans">
            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="flex items-center gap-3 mb-4">
                    <Newspaper className="w-8 h-8 text-blue-500" />
                    <h1 className="text-4xl font-black text-white tracking-tight">투자 인사이트</h1>
                </div>
                <p className="text-lg text-zinc-400 mb-12 font-medium">검색 트렌드와 AI 알고리즘을 결합한 실전 투자 교육 아카이브입니다.</p>
                
                <div className="grid gap-6">
                    {posts.length === 0 && (
                        <div className="p-10 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-[#0a0a0c]">
                            <h3 className="text-xl font-bold text-zinc-400 mb-2">작성된 글이 없습니다</h3>
                            <p className="text-zinc-600">SEO 봇이 곧 첫 번째 칼럼을 작성할 예정입니다.</p>
                        </div>
                    )}
                    {posts.map((post: any) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="block group bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-2xl hover:bg-zinc-900 hover:border-blue-500/50 transition-all duration-300">
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{post.title}</h2>
                            <p className="text-zinc-400 mb-5 leading-relaxed">{post.description}</p>
                            <div className="text-sm font-bold text-zinc-600 tracking-wide">{post.date}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
