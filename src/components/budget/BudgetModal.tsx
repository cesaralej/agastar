import { useState } from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, budget: number) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name, budget);
    setName("");
    setBudget(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Add/Edit Budget</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Budget Amount"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
