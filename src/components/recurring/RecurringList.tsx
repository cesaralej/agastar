import RecurringItem from "./RecurringItem";
import { Recurring } from "@/types";
import { useRecurrings } from "@/context/RecurringContext";
import Spinner from "@/components/Spinner";

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
    return <Spinner loading={loading} />;
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
