import { useThoughtsControllerFindAll } from "../../api/generated";
import type { ThoughtDto } from "../../api/generated";
import useSessionStore from "../../hooks/useSessionStore";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

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
        <>
          <h1 className="text-xl md:text-2xl font-bold font-mogi px-6 py-6">
            ThoughtsList
          </h1>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-6">
            {(thoughts?.data as ThoughtDto[]).map((thought) => (
              <div key={thought.id}>
                <Link to={`/thoughts/${thought.id}`}>
                  <h2>{thought.ciphertext}</h2>
                </Link>
              </div>
            ))}
          </div> */}
        </>
      )}
    </div>
  );
}
