"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api, resolveMediaUrl } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Comment } from "@/lib/types";

interface SocialInteractionsProps {
    contentId: number;
    initialLikesCount: number;
}

export default function SocialInteractions({ contentId, initialLikesCount }: SocialInteractionsProps) {
    const router = useRouter();
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [liked, setLiked] = useState(false);
    const [likePending, setLikePending] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const commentCount = useMemo(() => comments.length, [comments]);

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            api.social
                .getLikeStatus(contentId, token)
                .then((response) => setLiked(response.liked))
                .catch(() => setLiked(false));
        }
    }, [contentId]);

    useEffect(() => {
        setCommentsLoading(true);
        api.public
            .getComments(contentId, { limit: 50, skip: 0 })
            .then((response) => setComments(response.items))
            .finally(() => setCommentsLoading(false));
    }, [contentId]);

    const requireAuth = () => {
        const token = getAccessToken();
        if (!token) {
            router.push("/login");
            return null;
        }
        return token;
    };

    const handleLike = async () => {
        if (likePending) return;
        const token = requireAuth();
        if (!token) return;

        setLikePending(true);
        try {
            if (liked) {
                await api.social.unlikeContent(contentId, token);
                setLiked(false);
                setLikesCount((prev) => Math.max(0, prev - 1));
            } else {
                await api.social.likeContent(contentId, token);
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
        if (!commentText.trim()) return;
        const token = requireAuth();
        if (!token) return;

        setCommentSubmitting(true);
        try {
            const newComment = await api.social.addComment(contentId, commentText.trim(), token);
            setComments((prev) => [newComment, ...prev]);
            setCommentText("");
        } finally {
            setCommentSubmitting(false);
        }
    };

    return (
        <>
            {/* Like & comment count bar */}
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

            {/* Comments section — rendered after separator in parent */}
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
