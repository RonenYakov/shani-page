import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableTile({ url, type, onDelete }: {
  url: string;
  type: "video" | "photo";
  onDelete: (url: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="admin-tile">
      {/* the drag HANDLE — only this grabs to drag, so Delete/controls still click normally */}
      <button className="admin-drag" {...attributes} {...listeners} aria-label="Drag to reorder">
        ⠿
      </button>

      {type === "video"
        ? <video className="admin-thumb" src={url} muted playsInline />
        : <img className="admin-thumb" src={url} alt="" />}

      <button className="admin-del" onClick={() => onDelete(url)}>Delete</button>
    </div>
  );
}
