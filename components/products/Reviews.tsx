"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Check, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { DELETE_REVIEW } from "@/graphql/actions/mutations/reviews/deleteReview";
import { UPDATE_REVIEW_STATUS } from "@/graphql/actions/mutations/reviews/updateStatus";

type ReviewStatus = "Pending" | "Approved" | "Rejected";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  imageUrl?: string | null;
  status: ReviewStatus;
};

const StarRating = ({ value }: { value: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={cn(
          "w-4 h-4",
          s <= value ? "fill-primary text-primary" : "text-muted-foreground",
        )}
      />
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: ReviewStatus }) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-full font-medium capitalize",
        map[status],
      )}
    >
      {status}
    </span>
  );
};

type Props = {
  theProduct: {
    id: string;
    name: string;
    images?: { url: string; isMain?: boolean }[];
  };
  reviews: Review[];
  refetch: () => void;
  loading: boolean;
};

const Reviews = ({ theProduct, reviews, refetch, loading }: Props) => {
  const [tab, setTab] = useState<ReviewStatus | "all">("all");
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);

  const [updateReviewStatus] = useMutation(UPDATE_REVIEW_STATUS);
  const [deleteReviewMutation] = useMutation(DELETE_REVIEW);

  const [page, setPage] = useState(1);
  const pageSize = 30;

  const topRef = useRef<HTMLDivElement | null>(null);

  const mainImage =
    theProduct.images?.find((img) => img.isMain) || theProduct.images?.[0];

  const filtered = useMemo(() => {
    if (tab === "all") return reviews;
    return reviews.filter((r) => r.status === tab);
  }, [reviews, tab]);

  const paginated = filtered?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filtered?.length / pageSize);

  const count = (status: ReviewStatus) =>
    reviews?.filter((r) => r.status === status).length;

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page, tab]);

  const handleTabChange = (value: string) => {
    setTab(value as ReviewStatus | "all");
    setPage(1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateStatus = async (
    id: number,
    status: "Approved" | "Rejected",
  ) => {
    try {
      await updateReviewStatus({
        variables: {
          input: {
            id: String(id),
            status,
          },
        },
      });

      toast.success(`Review ${status}`);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReviewMutation({
        variables: { id: String(id) },
      });

      toast.success("Review deleted");

      setOpenDialogId(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 ">
      <div ref={topRef} />

      <div className="space-y-3 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Reviews for {theProduct.name}</h2>

        {mainImage && (
          <Image
            src={mainImage.url}
            alt={theProduct.name}
            width={300}
            height={300}
            className="w-full max-w-xs rounded-lg object-cover"
          />
        )}
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList
          className="w-full rounded-3xl
         py-3 h-full"
        >
          <div className="flex flex-col sm:flex-row">
            <TabsTrigger value="all" className="px-4 py-3 rounded-3xl">
              All ({reviews?.length})
            </TabsTrigger>
            <TabsTrigger value="Pending" className="px-4 py-3 rounded-3xl">
              Pending ({count("Pending")})
            </TabsTrigger>
          </div>
          <div className="flex flex-col sm:flex-row">
            <TabsTrigger value="Approved" className="px-4 py-3 rounded-3xl">
              Approved ({count("Approved")})
            </TabsTrigger>
            <TabsTrigger value="Rejected" className="px-4 py-3 rounded-3xl">
              Rejected ({count("Rejected")})
            </TabsTrigger>
          </div>
        </TabsList>
      </Tabs>

      {loading && (
        <div className="flex justify-center items-center mx-auto my-6">
          <p>Loading reviews...</p>
        </div>
      )}

      {filtered?.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center space-y-4">
          <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
            💬
          </div>
          <p className="text-sm text-muted-foreground">
            No reviews in this category
          </p>
        </div>
      )}

      <div
        id="dashboard-scroll"
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 mb-8"
      >
        {paginated?.map((r) => (
          <Card
            key={r.id}
            className="break-inside-avoid mb-5 rounded-2xl overflow-hidden border border-border/50 hover:shadow-md transition"
          >
            {r.imageUrl && (
              <Image
                src={r.imageUrl}
                alt="image_review"
                width={300}
                height={300}
                className="w-full h-auto object-cover"
              />
            )}

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <StarRating value={r.rating} />
                </div>

                <StatusBadge status={r.status} />
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {r.comment}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleUpdateStatus(r.id, "Approved")}
                  disabled={r.status === "Approved"}
                >
                  <Check className="w-4 h-4 text-green-600" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleUpdateStatus(r.id, "Rejected")}
                  disabled={r.status === "Rejected"}
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>

                <Dialog
                  open={openDialogId === r.id}
                  onOpenChange={(open) => {
                    if (!open) setOpenDialogId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setOpenDialogId(r.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-background w-[320px] md:w-[450px] rounded-3xl r ">
                    <DialogHeader className="">
                      <DialogTitle>Delete this review?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteReview(r.id)}
                      className="mt-6 w-full rounded-3xl"
                    >
                      Confirm Delete
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4 mb-8">
          <Button
            variant="default"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full px-4 py-3"
          >
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>

          <Button
            variant="default"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full px-4 py-3"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
