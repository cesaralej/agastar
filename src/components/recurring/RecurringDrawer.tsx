import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecurringForm from "@/components/recurring/RecurringForm";
import { useRecurrings } from "@/context/RecurringContext";

import { Recurring, RecurringData } from "@/types";

const RecurringDrawer = ({
  isEdit,
  showSheet,
  setShowSheet,
  initialData,
  onAdd,
  onEdit,
}: {
  isEdit?: boolean;
  showSheet: boolean;
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Recurring> | null;
  onAdd: (recurring: RecurringData) => Promise<void>;
  onEdit: (recurringId: string, recurring: RecurringData) => Promise<void>;
}) => {
  const { deleteRecurring } = useRecurrings();

  const handleDelete = (recurringId: string) => {
    if (
      window.confirm("Are you sure you want to delete this recurring item?")
    ) {
      deleteRecurring(recurringId);
      setShowSheet(false);
    }
  };

  return (
    <Drawer open={showSheet} onOpenChange={setShowSheet}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? "Update Recurring" : "Add Recurring"}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <div className={`pt-6 px-6 ${isEdit ? "pb-0" : "pb-6"}`}>
            <RecurringForm
              setShowSheet={setShowSheet}
              initialData={initialData}
              isEdit={isEdit}
              onAdd={onAdd}
              onEdit={onEdit}
            />
          </div>
        </ScrollArea>
        {isEdit && (
          <DrawerFooter className="px-6 pb-6">
            <button
              onClick={() => {
                if (initialData?.id) {
                  handleDelete(initialData?.id);
                }
              }}
              className="bg-red-500 text-white text-sm py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
export default RecurringDrawer;
