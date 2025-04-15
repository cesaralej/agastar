import { useState, useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Budget } from "@/types";

const schema = z.object({
  amount: z
    .string()
    .min(1, "cannot be empty")
    .default("")
    .refine((val) => !isNaN(Number(val)), { message: "Invalid amount" }),
});

const BudgetForm = ({
  setShowSheet,
  initialData = null,
}: {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Budget> | null;
}) => {
  const { updateBudget, previousBudgets } = useBudgets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const form = useForm<Budget>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount?.toString() || "",
    },
  });

  const previousBudget = previousBudgets(
    initialData?.month || 0,
    initialData?.year || 0,
    initialData?.category || ""
  );
  const previousBudgetAmount = previousBudget[0]?.amount
    ? `€ ${previousBudget[0].amount}`
    : "None";

  useEffect(() => {
    if (
      initialData?.category === "luxury" ||
      initialData?.category === "utilities"
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [initialData?.category, form]);

  const handleSubmit = async (data: Budget) => {
    setIsSubmitting(true);
    const updatedBudget = {
      ...initialData,
      amount: data.amount,
    };
    if (initialData?.id) {
      try {
        await updateBudget(updatedBudget as Budget);
        toast("Budget updated");
      } catch (error) {
        console.error("Error updating budget:", error);
        toast.error("Uh oh! Something went wrong.");
      }
    }
    setShowSheet(false);

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  {" "}
                  {/* Container for prefix and input */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    €
                  </div>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="50.00"
                    aria-label="Amount"
                    className="pl-7"
                    disabled={isDisabled}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Previous Budget:{" "}
                <span className="font-semibold">{previousBudgetAmount}</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
export default BudgetForm;
