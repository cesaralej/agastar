import RecurringItem from "./RecurringItem";

interface Expense {
  id: string;
  name: string;
  dueDate: Date;
  amount: number;
}

interface RecurringListProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RecurringList = ({ expenses, onEdit, onDelete }: RecurringListProps) => {
  return (
    <div className="mt-4">
      {expenses.map((expense: Expense) => (
        <RecurringItem
          key={expense.id}
          expense={expense}
          onEdit={() => onEdit(expense.id)}
          onDelete={() => onDelete(expense.id)}
        />
      ))}
    </div>
  );
};
export default RecurringList;
