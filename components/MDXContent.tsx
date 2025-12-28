import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import ZoomImage from "@/components/ZoomImage";
import { AlertTriangle } from "lucide-react";

const options = {
  theme: "github-dark",
  keepBackground: true,
};

const components = {
  img: (props: any) => <ZoomImage src={props.src} alt={props.alt} />,
};

export default async function MDXContent({ source }: { source: string }) {
  try {
    const { content } = await compileMDX({
      source,
      components,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypePrettyCode as any, options]],
        },
      },
    });

    return (
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive my-4">
        <div className="flex items-center gap-2 font-bold text-lg mb-2">
          <AlertTriangle className="h-5 w-5" />
          MDX Compilation Error
        </div>
        <p className="text-sm mb-4">
          There is a syntax error in the content. Please edit the post in the Admin Dashboard to fix it.
        </p>
        <pre className="bg-background/50 p-4 rounded text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[200px] border border-destructive/20">
          {error.message}
        </pre>
      </div>
    );
  }
}
