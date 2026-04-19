import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getThoughtsControllerFindOneQueryKey,
  thoughtsControllerRemove,
  useThoughtsControllerFindOne,
  useThoughtsControllerUpdate,
} from "../../api/generated";
import { FiArrowLeft, FiEdit, FiTrash, FiCheck, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DateConverter from "@/utils/DateConverter";
import useSessionStore from "../../hooks/useSessionStore";
import useAuthStore from "../../hooks/useAuthStore";
import {
  buildThoughtPayload,
  decryptThoughtPayload,
  type PlainThoughtValues,
} from "../../services/buildThoughtPayload";
import { MOOD_ENUM } from "../../constants/enum";
import { Textarea } from "@/components/ui/textarea";

type EditableDraft = Pick<
  PlainThoughtValues,
  "thought" | "context" | "trigger"
>;

export default function ThoughtView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const masterKey = useSessionStore((s) => s.masterKey);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: thought } = useThoughtsControllerFindOne(id as string);
  const [decrypted, setDecrypted] = useState<PlainThoughtValues | null>(null);
  const [decryptError, setDecryptError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableDraft | null>(null);

  const updateThought = useThoughtsControllerUpdate({
    mutation: {
      onSuccess: () => {
        toast.success(t("thoughts.updateSuccess"));
        setIsEditing(false);
        if (id) {
          queryClient.invalidateQueries({
            queryKey: getThoughtsControllerFindOneQueryKey(id),
          });
        }
      },
      onError: () => {
        toast.error(t("common.editError"));
      },
    },
  });

  useEffect(() => {
    const payload = thought?.data;
    if (!payload || !masterKey) return;

    let cancelled = false;
    (async () => {
      try {
        const plain = await decryptThoughtPayload(
          {
            ciphertext: payload.ciphertext,
            iv: payload.iv,
            authTag: payload.authTag,
          },
          masterKey,
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
  }, [thought, masterKey]);

  const handleDelete = async () => {
    try {
      await thoughtsControllerRemove(id as string);
      navigate("/thoughts");
    } catch (error) {
      console.error(error);
      toast.error(t("common.deleteError"));
    }
  };

  const handleStartEdit = () => {
    if (!decrypted) return;
    setDraft({
      thought: decrypted.thought,
      context: decrypted.context,
      trigger: decrypted.trigger,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft(null);
  };

  const handleSaveEdit = async () => {
    if (!id || !decrypted || !draft || !masterKey || !user) return;
    try {
      const data = await buildThoughtPayload(
        {
          mood: decrypted.mood,
          legitimate: decrypted.legitimate,
          thought: draft.thought,
          context: draft.context,
          trigger: draft.trigger,
        },
        masterKey,
        user.id,
      );
      updateThought.mutate({ id, data });
    } catch (err) {
      console.error(err);
      toast.error(t("common.editError"));
    }
  };

  const mood = decrypted?.mood ? MOOD_ENUM[decrypted.mood] : null;
  const isSaving = updateThought.isPending;

  return (
    <div className="font-general text-dark_blue px-6 py-10 md:px-20 md:py-14 overflow-x-hidden">
      <div className="flex justify-between items-center gap-2">
        <Link
          to="/thoughts"
          aria-label={t("common.back")}
          className="p-3 sm:px-6 sm:py-3 cursor-pointer rounded-full font-bold text-dark_blue bg-transparent border border-dark_blue/30 hover:bg-dark_blue/5 transition-all"
        >
          <div className="flex items-center gap-2">
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("common.back")}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                aria-label={t("common.cancel")}
                className="p-3 sm:px-6 sm:py-3 cursor-pointer rounded-full font-bold text-dark_blue bg-transparent border border-dark_blue/30 hover:bg-dark_blue/5 disabled:opacity-40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">{t("common.cancel")}</span>
                  <FiX className="w-4 h-4" />
                </div>
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                aria-label={t("common.save")}
                className="p-3 sm:px-6 sm:py-3 cursor-pointer rounded-full font-bold text-white bg-dark_blue hover:bg-dark_blue/85 disabled:opacity-40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">
                    {isSaving ? t("common.saving") : t("common.save")}
                  </span>
                  <FiCheck className="w-4 h-4" />
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartEdit}
                disabled={!decrypted}
                aria-label={t("common.edit")}
                className="p-3 sm:px-6 sm:py-3 cursor-pointer rounded-full font-bold text-white bg-dark_blue hover:bg-dark_blue/85 disabled:opacity-40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">{t("common.edit")}</span>
                  <FiEdit className="w-4 h-4" />
                </div>
              </button>
              <button
                onClick={handleDelete}
                aria-label={t("common.delete")}
                className="p-3 sm:px-6 sm:py-3 cursor-pointer rounded-full font-bold text-red-600 border border-red-700 hover:bg-red-600/5 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">{t("common.delete")}</span>
                  <FiTrash className="w-4 h-4" />
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="my-8">
        <p>
          {t("thoughts.createdAt")}:{" "}
          <span className="font-bold text-sm md:text-base">
            {DateConverter(thought?.data.createdAt ?? "")}
          </span>
        </p>
      </div>

      {decryptError && (
        <p className="text-red-600 font-medium">{t("thoughts.decryptError")}</p>
      )}

      {decrypted && mood && (
        <>
          <div className="flex flex-wrap text-sm md:text-base items-center gap-x-4 md:gap-x-8 gap-y-2">
            <p>
              {t("thoughts.mood")}:{" "}
              <span
                className="font-bold uppercase tracking-wide"
                style={{ color: mood.color }}
              >
                {t(`mood.${decrypted.mood}`, { defaultValue: mood.label })}
              </span>
            </p>
            <p>
              {t("thoughts.time")}:{" "}
              <span className="font-bold uppercase tracking-wide">
                {t(`timeIndex.${decrypted.time}`, {
                  defaultValue: decrypted.time,
                })}
              </span>
            </p>
            <p>
              {t("thoughts.legitimate")}:{" "}
              <span className="font-bold">
                {t(`legitimate.${decrypted.legitimate}`, {
                  defaultValue: decrypted.legitimate,
                })}
              </span>
            </p>
          </div>

          <section className="mt-10 flex flex-col gap-6">
            <EditableField
              label={t("thoughts.thought")}
              mood={decrypted.mood}
              value={isEditing ? (draft?.thought ?? "") : decrypted.thought}
              editing={isEditing}
              onChange={(v) => setDraft((d) => (d ? { ...d, thought: v } : d))}
            />
            <EditableField
              label={t("thoughts.context")}
              mood={decrypted.mood}
              value={isEditing ? (draft?.context ?? "") : decrypted.context}
              editing={isEditing}
              onChange={(v) => setDraft((d) => (d ? { ...d, context: v } : d))}
            />
            <EditableField
              label={t("thoughts.trigger")}
              mood={decrypted.mood}
              value={isEditing ? (draft?.trigger ?? "") : decrypted.trigger}
              editing={isEditing}
              onChange={(v) => setDraft((d) => (d ? { ...d, trigger: v } : d))}
            />
          </section>
        </>
      )}
    </div>
  );
}

function EditableField({
  label,
  mood,
  value,
  editing,
  onChange,
}: {
  label: string;
  mood: keyof typeof MOOD_ENUM;
  value: string;
  editing: boolean;
  onChange: (next: string) => void;
}) {
  const mood_color = MOOD_ENUM[mood].color;
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-dark_blue/60">
        {label}
      </h2>
      {editing ? (
        <Textarea
          className="mt-2"
          style={{ borderColor: mood_color }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          className="mt-2 rounded-lg border px-3 py-2"
          style={{ borderColor: mood_color }}
        >
          <p className="whitespace-pre-wrap">{value}</p>
        </div>
      )}
    </div>
  );
}
