import { useState, useEffect } from "react";
import categories from "@/data/categories";
import { useToast } from "@/hooks/use-toast";
import { TransactionData } from "@/types";

const typeOptions = ["income", "expense"];

const accountOptions = {
  income: ["savings"],
  expense: ["savings", "credit"],
};

const categoryOptions = {
  income: ["salary", "other"],
  expense: Object.keys(categories).filter((category) => category !== "salary"),
};

interface TransactionFormProps {
  onSubmit: (formData: TransactionData) => Promise<void>;
}

interface ChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const { toast } = useToast();
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState<{
    amount: string;
    description: string;
    category: string;
    type: keyof typeof accountOptions;
    account: string;
    date: string;
    time: string;
    comment: string;
    isCreditCardPayment: boolean;
  }>({
    amount: "",
    description: "",
    category: "luxury",
    type: "expense", // Default type
    account: "credit", // Default account
    date: getTodayDate(),
    time: getCurrentTime(),
    comment: "",
    isCreditCardPayment: false,
  });

  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    if (formData.type === "income") {
      setFormData((prevData) => ({
        ...prevData,
        account: "savings",
        category: "salary",
      }));
    }
  }, [formData.type]);

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => {
      let newDescription = prevData.description;

      if (!prevData.isCreditCardPayment) {
        // Checkbox is being checked
        newDescription = "Credit Card"; // Add " - Credit Card" if there's existing text
      } else {
        // Checkbox is being unchecked
        newDescription = newDescription.replace("Credit Card", "").trim(); // Remove " - Credit Card" or "Credit Card"
      }

      return {
        ...prevData,
        type: "expense",
        account: "savings",
        category: "other",
        description: newDescription,
        isCreditCardPayment: !prevData.isCreditCardPayment,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill out all fields.");
      return;
    }

    if (
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0 ||
      formData.amount.trim() === ""
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await onSubmit(formData);
      toast({ title: "Transaction added successfully!" });
      setFormData({
        amount: "",
        description: "",
        category: "luxury",
        type: "expense",
        account: "credit",
        date: getTodayDate(),
        time: getCurrentTime(),
        comment: "",
        isCreditCardPayment: false,
      });
      setShowComment(false);
    } catch (error) {
      console.error("Error adding transaction: ", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <div className="flex items-center">
        <label htmlFor="amount" className="w-1/3 text-sm font-medium">
          Amount:{" "}
        </label>
        <div className="flex flex-grow">
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="50"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
          />
          <span className="ml-2 text-gray-500">€</span>
        </div>
      </div>
      <div className="flex items-center">
        <label htmlFor="description" className="w-1/3 text-sm font-medium">
          Description:
        </label>
        <input
          type="text"
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          disabled={formData.isCreditCardPayment}
          placeholder="e.g., Coffee at Starbucks"
          maxLength={50}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="type" className="w-1/3 text-sm font-medium">
          Type:
        </label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          disabled={formData.isCreditCardPayment}
          className={`rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full ${
            formData.isCreditCardPayment ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label htmlFor="account" className="w-1/3 text-sm font-medium">
          Account:
        </label>
        <select
          name="account"
          id="account"
          value={formData.account}
          onChange={handleChange}
          required
          disabled={formData.isCreditCardPayment}
          className={`rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full ${
            formData.isCreditCardPayment ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          {accountOptions[formData.type].map((account) => (
            <option key={account} value={account}>
              {account.charAt(0).toUpperCase() + account.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label htmlFor="category" className="w-1/3 text-sm font-medium">
          Category:
        </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={formData.isCreditCardPayment}
          className={`rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full ${
            formData.isCreditCardPayment ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          {categoryOptions[formData.type].map((categoryKey) => (
            <option key={categoryKey} value={categoryKey}>
              {categories[categoryKey as keyof typeof categories].name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <label htmlFor="date" className="w-1/3 text-sm font-medium">
          Date:
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="flex items-center">
        <label htmlFor="time" className="w-1/3 text-sm font-medium">
          Time:
        </label>
        <input
          type="time"
          name="time"
          id="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="flex items-center">
        <label
          htmlFor="isCreditCardPayment"
          className="w-1/3 text-sm font-medium"
        >
          <input
            type="checkbox"
            name="isCreditCardPayment"
            id="isCreditCardPayment"
            checked={formData.isCreditCardPayment}
            onChange={handleCheckboxChange}
            className="mr-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          Credit Card Payment
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowComment((prev) => !prev)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {showComment ? "Hide Comment" : "Add Comment"}
        </button>
      </div>

      {showComment && (
        <div className="mt-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comment:
          </label>
          <textarea
            name="comment"
            id="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Add an optional note about this transaction"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
          />
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
