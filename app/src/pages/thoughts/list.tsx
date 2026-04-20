import { useThoughtsControllerFindAll } from "../../api/generated";
import type { ThoughtDto } from "../../api/generated";
import useSessionStore from "../../hooks/useSessionStore";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { TableComponent } from "../../components/Table";
import {
  decryptThoughtPayload,
  type PlainThoughtValues,
} from "../../services/buildThoughtPayload";
import { useEffect, useState } from "react";
import useScreenSize from "@/hooks/useScreenSize";
import { ThoughtCard } from "@/components/ThoughtCard";

export type DecryptedThought = PlainThoughtValues & {
  id: string;
  createdAt: string;
};

export default function ThoughtsList() {
  const accessToken = useSessionStore((s) => s.accessToken);
  const masterKey = useSessionStore((s) => s.masterKey);
  const [decrypted, setDecrypted] = useState<DecryptedThought[]>([]);
  const [decryptError, setDecryptError] = useState(false);
  const { data: thoughts } = useThoughtsControllerFindAll(
    {},
    {
      query: {
        enabled: !!accessToken,
      },
    },
  );

  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 640;

  useEffect(() => {
    const payload = thoughts?.data as ThoughtDto[] | undefined;

    if (!payload || !masterKey) return;

    let cancelled = false;
    (async () => {
      try {
        const plain = await Promise.all(
          payload.map(async (item) => {
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
  }, [thoughts, masterKey]);
  const handleDelete = (id: string) => {
    console.log(id);
  };
  return (
    <div>
      {thoughts?.data && (thoughts?.data as ThoughtDto[]).length < 1 ? (
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
      ) : (
        <div className="min-h-screen flex flex-col px-6 py-10 md:px-20 md:py-14 font-general text-dark_blue">
          <div className="flex items-center justify-between gap-4">
            Filters
            <button className="flex items-center gap-2 bg-dark_blue cursor-pointer py-3 px-6 md:py-4 md:px-8 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-dark_blue/80 transition-all duration-300">
              <FiPlus className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              Add
            </button>
          </div>
          <div className="mt-10">
            {decryptError ? (
              <p className="text-red-600 font-medium">
                Could not decrypt your thoughts.
              </p>
            ) : isMobile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decrypted.map((thought) => (
                  <ThoughtCard key={thought.id} thought={thought} />
                ))}
              </div>
            ) : (
              <TableComponent data={decrypted} handleDelete={handleDelete} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
