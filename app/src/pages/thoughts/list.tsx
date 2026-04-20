import { thoughtsControllerFindAll } from "../../api/generated";
import useSessionStore from "../../hooks/useSessionStore";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { TableComponent } from "../../components/Table";
import {
  decryptThoughtPayload,
  type PlainThoughtValues,
} from "../../services/buildThoughtPayload";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useScreenSize from "@/hooks/useScreenSize";
import { ThoughtCard } from "@/components/ThoughtCard";
import { CursorPagination } from "@/components/Pagination";

export type DecryptedThought = PlainThoughtValues & {
  id: string;
  createdAt: string;
};

const PAGE_SIZE = 20;

export default function ThoughtsList() {
  const accessToken = useSessionStore((s) => s.accessToken);
  const masterKey = useSessionStore((s) => s.masterKey);

  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 640;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["thoughts"],
      queryFn: ({ pageParam }) =>
        thoughtsControllerFindAll({
          cursor: pageParam,
          take: PAGE_SIZE,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
      enabled: !!accessToken,
    });

  const allItems = useMemo(
    () => data?.pages.flatMap((page) => page.data.data) ?? [],
    [data],
  );

  const [decrypted, setDecrypted] = useState<DecryptedThought[]>([]);
  const [decryptError, setDecryptError] = useState(false);

  const loadedPages = data?.pages.length ?? 0;
  const [currentPage, setCurrentPage] = useState(1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), loadedPages || 1);
  const pageItemIds = useMemo(() => {
    if (isMobile) return null;
    const page = data?.pages[safeCurrentPage - 1];
    return new Set(page?.data.data.map((i) => i.id) ?? []);
  }, [data, safeCurrentPage, isMobile]);

  const visibleDecrypted = useMemo(
    () =>
      pageItemIds ? decrypted.filter((d) => pageItemIds.has(d.id)) : decrypted,
    [decrypted, pageItemIds],
  );

  useEffect(() => {
    if (!masterKey || allItems.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const plain = await Promise.all(
          allItems.map(async (item) => {
            const decryptedItem = await decryptThoughtPayload(
              {
                ciphertext: item.ciphertext,
                iv: item.iv,
                authTag: item.authTag,
              },
              masterKey,
            );
            return {
              ...decryptedItem,
              id: item.id,
              createdAt: item.createdAt,
            } satisfies DecryptedThought;
          }),
        );
        if (!cancelled) setDecrypted(plain);
      } catch (err) {
        console.error(err);
        if (!cancelled) setDecryptError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [allItems, masterKey]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isMobile) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleDelete = (id: string) => {
    console.log(id);
  };

  if (!isLoading && allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-6 md:gap-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-general text-dark_blue">
          No thoughts yet !
        </h1>
        <Link
          to="/thoughts/new"
          className="bg-dark_blue py-3 px-6 md:py-4 md:px-8 text-white rounded-full font-semibold text-base sm:text-lg md:text-2xl lg:text-3xl hover:bg-dark_blue/80 transition-all duration-300"
        >
          <span className="flex items-center gap-2 md:gap-4">
            <FiPlus className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            Add a new thought
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 md:px-20 md:py-14 font-general text-dark_blue">
      <div className="flex items-center justify-between gap-4">
        Filters
        <Link
          to="/thoughts/new"
          className="flex items-center gap-2 bg-dark_blue cursor-pointer py-3 px-6 md:py-4 md:px-8 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-dark_blue/80 transition-all duration-300"
        >
          <FiPlus className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
          Add
        </Link>
      </div>

      <div className="mt-10">
        {decryptError ? (
          <p className="text-red-600 font-medium">
            Could not decrypt your thoughts.
          </p>
        ) : isMobile ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {decrypted.map((thought) => (
                <ThoughtCard key={thought.id} thought={thought} />
              ))}
            </div>
            <div ref={sentinelRef} className="h-10" aria-hidden />
            {isFetchingNextPage && (
              <p className="text-center text-sm text-dark_blue/60 py-4">
                Loading more...
              </p>
            )}
          </>
        ) : (
          <>
            <TableComponent
              data={visibleDecrypted}
              handleDelete={handleDelete}
            />
            <div className="mt-6">
              <CursorPagination
                currentPage={safeCurrentPage}
                loadedPages={loadedPages}
                hasMore={!!hasNextPage}
                isFetching={isFetchingNextPage}
                onPageChange={setCurrentPage}
                onFetchMore={() => void fetchNextPage()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
