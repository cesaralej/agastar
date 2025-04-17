import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import RecurringForm from "@/components/recurring/RecurringForm";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useRecurrings } from "@/context/RecurringContext";
import { useTransactions } from "@/context/TransactionContext";
import {
  Recurring,
  RecurringData,
  Transaction,
  TransactionData,
} from "@/types";

interface RecurringDrawerProps {
  isEdit?: boolean;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Recurring> | null;
  onAddRecurring: (recurring: RecurringData) => Promise<void>;
  onEditRecurring: (
    recurringId: string,
    recurring: RecurringData
  ) => Promise<void>;
}

const RecurringDrawer = ({
  isEdit = false,
  showSheet,
  setShowSheet,
  initialData,
  onAddRecurring,
  onEditRecurring,
}: RecurringDrawerProps) => {
  const { deleteRecurring } = useRecurrings();
  const { getRecentPaymentsForRecurring } = useTransactions();
  const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);

  // State to manage the mode within the drawer when isEdit is true
  const [mode, setMode] = useState<"view" | "edit" | "pay">("view");

  useEffect(() => {
    if (mode === "view" && initialData) {
      const history = getRecentPaymentsForRecurring(initialData as Recurring);
      setPaymentHistory(history);
    }
  }, [mode, initialData, getRecentPaymentsForRecurring]);

  // Reset mode to 'view' when the drawer is opened for editing an existing item
  useEffect(() => {
    if (showSheet && isEdit) {
      setMode("view");
    }
    // If opening for 'Add', mode doesn't matter
  }, [showSheet, isEdit]);

  const handleDelete = async () => {
    if (
      initialData?.id &&
      window.confirm("Are you sure you want to delete this recurring item?")
    ) {
      try {
        await deleteRecurring(initialData.id);
        setShowSheet(false);
        // Add success feedback (e.g., toast) if desired
      } catch (error) {
        console.error("Failed to delete recurring item:", error);
        // Add error feedback (e.g., toast)
      }
    }
  };

  // Prepare initial data for the TransactionForm when "Pay" is clicked
  const prepareTransactionData = (): Partial<TransactionData> => {
    if (!initialData) return {};
    return {
      description: initialData.description || "",
      amount: initialData.amount?.toString() || "", // Transaction form might expect string amount
      category: "utilities", // Ensure category exists
      account: initialData.account || "savings", // Ensure account exists
      type: "expense", // Payments are typically expenses
      date: new Date(), // Default payment date to now
    };
  };

  // Determine Drawer Title based on state
  const getDrawerTitle = (description: string) => {
    if (!isEdit) return "Add Recurring Item";
    switch (mode) {
      case "view":
        return `Details for ${description}`;
      case "edit":
        return "Edit Recurring Item";
      case "pay":
        return "Add New Payment";
      default:
        return "";
    }
  };

  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent className="max-h-[90vh]">
        {" "}
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {getDrawerTitle(initialData?.description || "")}
          </DrawerTitle>
        </DrawerHeader>
        {/* Scrollable content area */}
        <ScrollArea className="overflow-y-auto px-4">
          {" "}
          {/* Add padding here */}
          <div className="py-4">
            {" "}
            {/* Inner padding */}
            {/* --- Mode 1: Add New Recurring Item --- */}
            {!isEdit && (
              <RecurringForm
                setShowSheet={setShowSheet}
                initialData={null} // Explicitly null for add mode
                isEdit={false}
                onAdd={onAddRecurring}
                onEdit={async () => Promise.resolve()} // Dummy onEdit for add mode
              />
            )}
            {/* --- Mode 2: View Existing Recurring Item Details --- */}
            {isEdit && mode === "view" && initialData && (
              <div className="space-y-6">
                {/* Display basic info (customize as needed) 
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-gray-700">{initialData.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Amount</h3>
                  <p className="text-gray-700">{initialData.amount}€</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Due Day</h3>
                  <p className="text-gray-700">{initialData.dueDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Account</h3>
                  <p className="text-gray-700 capitalize">
                    {initialData.account}
                  </p>
                </div>*/}
                {/* --- Payment History Placeholder --- */}
                <div className="">
                  <h3 className="font-semibold mb-2 text-lg border-b pb-1">
                    Payment History
                  </h3>
                  <div className="space-y-2 text-sm">
                    {paymentHistory.length > 0 ? (
                      paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex justify-between items-center p-2 rounded bg-gray-50"
                        >
                          <span>
                            {payment.date
                              ? payment.date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              : "No Date"}
                          </span>
                          <span className="font-medium">{payment.amount}€</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No recent payment history found.
                      </p>
                    )}
                  </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={() => setMode("pay")} className="flex-1">
                    Add New Payment
                  </Button>
                  <Button
                    onClick={() => setMode("edit")}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit Details
                  </Button>

                  <Button
                    variant="destructive" // Use destructive variant
                    onClick={handleDelete}
                    className="w-full" // Make it full width
                  >
                    Delete Item
                  </Button>
                </div>

                {/* --- Delete Button --- */}
                <div className=""></div>
              </div>
            )}
            {/* --- Mode 3: Edit Existing Recurring Item --- */}
            {isEdit && mode === "edit" && (
              <RecurringForm
                setShowSheet={setShowSheet}
                initialData={initialData}
                isEdit={true}
                onAdd={async () => Promise.resolve()} // Provide a valid async function
                onEdit={onEditRecurring}
              />

              // Optionally add a "Cancel Edit" button here or rely on drawer close
            )}
            {/* --- Mode 4: Pay Existing Recurring Item (Show Transaction Form) --- */}
            {isEdit && mode === "pay" && (
              <TransactionForm
                setShowSheet={setShowSheet} // Pass down to close drawer on success
                initialData={prepareTransactionData()}
                isEdit={false} // We are ADDING a transaction
              />
              // Optionally add a "Cancel Payment" button here
            )}
          </div>
        </ScrollArea>
        {/* Footer can be used for general actions like Close, or removed if actions are inline */}
        {/* Example: Add a close button if needed, especially for edit/pay modes */}
        {(mode === "edit" || mode === "pay") && (
          <DrawerFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setMode("view")}>
              Back to Details
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
export default RecurringDrawer;
