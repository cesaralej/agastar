import RecurringItem from "./RecurringItem";

const RecurringList = ({ expenses, onEdit, onDelete }: any) => {
  return (
    <div className="mt-4">
      {expenses.map((expense: any) => (
        <RecurringItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
export default RecurringList;
