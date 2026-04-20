import { Link } from "react-router-dom";
import DateConverter from "../utils/DateConverter";
import { FiEye, FiTrash } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOOD_ENUM } from "../constants/enum";
import type { DecryptedThought } from "../pages/thoughts/list";

export function TableComponent({
  data,
  handleDelete,
}: {
  data: DecryptedThought[];
  handleDelete: (id: string) => void;
}) {
  return (
    <Table className="w-full font-general text-dark_blue">
      <TableHeader className="bg-dark_blue ">
        <TableRow className="hover:bg-dark_blue">
          <TableHead className="font-semibold text-white">Mood</TableHead>
          <TableHead className="font-semibold text-white text-center">
            Thought
          </TableHead>
          <TableHead className="font-semibold text-white text-center">
            Time
          </TableHead>
          <TableHead className="font-semibold text-white text-center">
            Legitimate
          </TableHead>
          <TableHead className="font-semibold text-white text-center">
            Created At
          </TableHead>
          <TableHead className="text-right font-semibold text-white">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => {
          const moodMeta = MOOD_ENUM[item.mood];
          return (
            <TableRow
              key={item.id}
              style={
                {
                  "--mood-hover-bg": `${moodMeta?.color}1A`,
                } as React.CSSProperties
              }
              className="hover:bg-(--mood-hover-bg)"
            >
              <TableCell className="font-medium">
                <span style={{ color: moodMeta?.color }}>
                  {moodMeta?.label ?? item.mood}
                </span>
              </TableCell>
              <TableCell className="font-medium max-w-24 truncate text-center">
                {item.thought}
              </TableCell>
              <TableCell className="font-medium uppercase text-center">
                {item.time}
              </TableCell>
              <TableCell className="font-medium text-center">
                {item.legitimate}
              </TableCell>
              <TableCell className="font-medium text-center">
                {DateConverter(item.createdAt)}
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-8">
                <Link to={`/thoughts/${item.id}`}>
                  <FiEye className="w-4 h-4 cursor-pointer text-dark_blue hover:text-dark_blue/60 transition-all duration-300" />
                </Link>
                <button onClick={() => handleDelete(item.id)}>
                  <FiTrash className="w-4 h-4 cursor-pointer text-red-600 hover:text-red-600/60 transition-all duration-300" />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
