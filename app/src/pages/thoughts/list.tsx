import { useThoughtsControllerFindAll } from "../../api/generated";
import type { ThoughtDto } from "../../api/generated";
import useSessionStore from "../../hooks/useSessionStore";
import { Link } from "react-router-dom";

export default function ThoughtsList() {
  const accessToken = useSessionStore((s) => s.accessToken);
  const { data: thoughts } = useThoughtsControllerFindAll(
    {},
    {
      query: {
        enabled: !!accessToken,
      },
    },
  );
  return (
    <div>
      {thoughts?.data && (thoughts?.data as ThoughtDto[]).length < 1 ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold font-general text-dark_blue">
            No thoughts yet !
          </h1>
          <Link
            to="/thoughts/new"
            className="bg-dark_blue py-4 px-12 text-white rounded-full font-semibold text-3xl hover:bg-dark_blue/80 transition-all duration-300 mt-2 md:mt-8"
          >
            Create a new thought
          </Link>
        </div>
      ) : (
        <h1 className="text-2xl font-bold font-mogi">ThoughtsList</h1>
      )}
    </div>
  );
}
