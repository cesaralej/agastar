import RecurringItem from "./RecurringItem";
import { Recurring } from "@/types";
import { useRecurrings } from "@/context/RecurringContext";

const RecurringList = ({
  onEdit,
}: {
  onEdit: (recurring: Recurring) => void;
}) => {
  const { recurrings, loading, error } = useRecurrings();
  if (!recurrings || recurrings.length === 0) {
    return <div>No recurring expenses found.</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {recurrings.map((recurring: Recurring) => (
        <RecurringItem
          key={recurring.id}
          recurring={recurring}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
export default RecurringList;
