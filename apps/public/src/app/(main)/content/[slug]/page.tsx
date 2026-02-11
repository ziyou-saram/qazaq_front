"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
    Item,
    ItemContent,
    ItemHeader,
    ItemTitle,
    ItemFooter,
    ItemGroup,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ContentSkeleton, ArticleCardSkeleton } from "@/components/ui/skeleton";
import { api, resolveMediaUrl } from "@/lib/api";
import { useArticles, useCategories, useContent } from "@/hooks/use-api";
import { getAccessToken } from "@/lib/auth";
import type { Comment, ContentListItem } from "@/lib/types";


function renderMarkdown(markdown: string) {
    const escapeHtml = (input: string) =>
        input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const formatInline = (input: string) => {
        const escaped = escapeHtml(input);
        return escaped
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    };

    const lines = markdown.split(/\r?\n/);
    let html = "";
    let paragraph: string[] = [];
    let inList = false;

    const flushParagraph = () => {
        if (!paragraph.length) return;
        html += `<p>${formatInline(paragraph.join(" "))}</p>`;
        paragraph = [];
    };

    const closeList = () => {
        if (!inList) return;
        html += "</ul>";
        inList = false;
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            flushParagraph();
            closeList();
            continue;
        }

        const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
        if (headingMatch) {
            flushParagraph();
            closeList();
            const level = headingMatch[1].length;
            html += `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
            continue;
        }

        const listMatch = /^[-*]\s+(.*)$/.exec(trimmed);
        if (listMatch) {
            flushParagraph();
            if (!inList) {
                html += "<ul>";
                inList = true;
            }
            html += `<li>${formatInline(listMatch[1])}</li>`;
            continue;
        }

        paragraph.push(trimmed);
    }

    flushParagraph();
    closeList();
    return html;
}

import DOMPurify from "isomorphic-dompurify";

function renderContent(content: string) {
    if (!content) return "";

    // Heuristic: check if content looks like HTML
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(content) || content.includes("<p>");

    if (isHtml) {
        return DOMPurify.sanitize(content, { ADD_ATTR: ['style', 'class'] });
    }

    return renderMarkdown(content);
}

export default function ContentSlugPage(props: { params: Promise<{ slug: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const { content, loading } = useContent(params.slug);
    const { data: articlesData, loading: articlesLoading } = useArticles({ limit: 3 });
    const { categoryMap } = useCategories();
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likePending, setLikePending] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const getCategoryName = (categoryId?: number | null) => {
        if (!categoryId) return null;
        return categoryMap.get(categoryId) || null;
    };

    const coverImage =
        resolveMediaUrl(content?.cover_image_url)

    useEffect(() => {
        if (!content) return;
        setLikesCount(content.likes_count || 0);
        const token = getAccessToken();
        if (!token) {
            setLiked(false);
            return;
        }
        api.social
            .getLikeStatus(content.id, token)
            .then((response) => setLiked(response.liked))
            .catch(() => setLiked(false));
    }, [content]);

    useEffect(() => {
        if (!content) return;
        setCommentsLoading(true);
        api.public
            .getComments(content.id, { limit: 50, skip: 0 })
            .then((response) => setComments(response.items))
            .finally(() => setCommentsLoading(false));
    }, [content]);

    const requireAuth = () => {
        const token = getAccessToken();
        if (!token) {
            router.push("/login");
            return null;
        }
        return token;
    };

    const handleLike = async () => {
        if (!content || likePending) return;
        const token = requireAuth();
        if (!token) return;

        setLikePending(true);
        try {
            if (liked) {
                await api.social.unlikeContent(content.id, token);
                setLiked(false);
                setLikesCount((prev) => Math.max(0, prev - 1));
            } else {
                await api.social.likeContent(content.id, token);
                setLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "";
            if (message.toLowerCase().includes("already liked")) {
                setLiked(true);
            }
        } finally {
            setLikePending(false);
        }
    };

    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!content || !commentText.trim()) return;
        const token = requireAuth();
        if (!token) return;

        setCommentSubmitting(true);
        try {
            const newComment = await api.social.addComment(content.id, commentText.trim(), token);
            setComments((prev) => [newComment, ...prev]);
            setCommentText("");
        } finally {
            setCommentSubmitting(false);
        }
    };

    const commentCount = useMemo(() => comments.length, [comments]);

    return (
        <>
            <div className="max-w-5xl mx-auto flex flex-col gap-14 md:gap-16 lg:gap-28">
                {loading || !content ? (
                    <ContentSkeleton />
                ) : (
                    <>
                        <div className="grid gap-4 justify-center-safe text-center">
                            <p className="text-muted-foreground">
                                {new Date(content.published_at || content.created_at).toLocaleDateString()}
                            </p>
                            <h1 className="text-foreground font-medium text-4xl md:text-5xl lg:text-6xl max-w-2xl">
                                {content.title}
                            </h1>
                            {content.excerpt ? (
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    {content.excerpt}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-8">
                            {coverImage && (
                                <Image
                                    src={coverImage}
                                    alt={content.title}
                                    width={1920}
                                    height={1080}
                                    className="w-full rounded-sm object-cover aspect-video"
                                />
                            )}
                            <div className="text-muted-foreground text-sm flex flex-wrap justify-center gap-2">
                                <span>
                                    {content.author.first_name} {content.author.last_name}
                                </span>
                                <span>•</span>
                                <span>{getCategoryName(content.category_id) || "Без категории"}</span>
                                <span>•</span>
                                <span>{content.view_count} просмотров</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Button
                                    variant={liked ? "default" : "secondary"}
                                    size="sm"
                                    onClick={handleLike}
                                    disabled={likePending}
                                    className="rounded-full"
                                >
                                    {liked ? "Понравилось" : "Нравится"} · {likesCount}
                                </Button>
                                <span className="text-muted-foreground text-sm">
                                    {commentCount} комментариев
                                </span>
                            </div>
                            <div
                                className="prose prose-lg prose-neutral max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderContent(content.content) }}
                            />
                        </div>
                    </>
                )}
            </div>

            <Separator />

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <h2 className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
                        Комментарии
                    </h2>
                    <form onSubmit={handleCommentSubmit} className="grid gap-3">
                        <Textarea
                            placeholder="Напишите комментарий..."
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                            rows={4}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={commentSubmitting || !commentText.trim()}>
                                {commentSubmitting ? "Отправляем..." : "Отправить"}
                            </Button>
                        </div>
                    </form>
                    <div className="grid gap-4">
                        {commentsLoading ? (
                            <p className="text-muted-foreground text-sm">Загрузка комментариев...</p>
                        ) : comments.length ? (
                            comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Пока нет комментариев. Будьте первым!
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-end-safe justify-between">
                    <h2 className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
                        Читайте также
                    </h2>
                    <Button variant={"link"} asChild>
                        <Link href={"/articles"}>Смотреть еще</Link>
                    </Button>
                </div>
                <ItemGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {articlesLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <ArticleCardSkeleton key={index} />
                        ))
                        : articlesData?.items.map((item) => (
                            <VerticalItemArticle
                                key={item.id}
                                content={item}
                                categoryName={getCategoryName(item.category_id)}
                            />
                        ))}
                </ItemGroup>
            </div>
        </>
    );
}

function CommentCard({ comment }: { comment: Comment }) {
    const initials = `${comment.user.first_name?.[0] || ""}${comment.user.last_name?.[0] || ""}`.toUpperCase();
    const avatarUrl = comment.user.avatar_url ? resolveMediaUrl(comment.user.avatar_url) : null;

    return (
        <div className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
                <Avatar className="size-9">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={comment.user.username} /> : null}
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">
                            {comment.user.first_name} {comment.user.last_name}
                        </span>
                        <span className="text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-foreground/90">{comment.content}</p>
                    {comment.replies?.length ? (
                        <div className="grid gap-3 border-l pl-4">
                            {comment.replies.map((reply) => (
                                <CommentCard key={reply.id} comment={reply} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function VerticalItemArticle({
    content,
    categoryName,
}: {
    content: ContentListItem;
    categoryName: string | null;
}) {
    const imageUrl =
        resolveMediaUrl(content.cover_image_url)

    return (
        <Item className="h-fit" asChild>
            <Link href={`/content/${content.slug}`}>
                {imageUrl && (
                    <ItemHeader>
                        <Image
                            src={imageUrl}
                            alt={content.title}
                            width={1920}
                            height={1080}
                            className="aspect-square w-full rounded-sm object-cover"
                        />
                    </ItemHeader>
                )}
                <ItemContent>
                    <ItemTitle className="text-foreground font-medium text-lg md:text-xl lg:text-2xl">
                        {content.title}
                    </ItemTitle>
                </ItemContent>
                <ItemFooter>
                    {categoryName ? `${categoryName} • ` : ""}
                    {new Date(content.published_at || content.created_at).toLocaleDateString()}
                </ItemFooter>
            </Link>
        </Item>
    );
}
