const RecurringItem = ({ expense, onEdit, onDelete }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{expense.name}</h3>
        <p className="text-gray-500 text-sm">
          Due: {expense.dueDate.toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-lg font-bold">${expense.amount}</p>
      </div>
      <div className="flex gap-2">
        <button className="text-blue-500" onClick={() => onEdit(expense.id)}>
          Edit
        </button>
        <button className="text-red-500" onClick={() => onDelete(expense.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecurringItem;
