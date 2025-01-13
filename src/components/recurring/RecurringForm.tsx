import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ACCOUNTS, Recurring, RecurringData } from "@/types";

const schema = z.object({
  amount: z.coerce.number().int().positive(),
  description: z.string(),
  account: z.enum(ACCOUNTS),
  dueDate: z.coerce.number().int().gte(1).lte(31),
});

const NewRecurring = ({
  setShowSheet,
  initialData = null,
  isEdit = false,
  onAdd,
  onEdit,
}: {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Recurring> | null;
  isEdit?: boolean;
  onAdd: (recurring: RecurringData) => Promise<void>;
  onEdit: (recurringId: string, recurring: RecurringData) => Promise<void>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RecurringData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || 0,
      description: initialData?.description || "",
      account: initialData?.account || "savings",
      dueDate: initialData?.dueDate || 1,
    },
  });

  if (initialData) {
    console.log("Initial data:", initialData);
  }

  const handleSubmit = (data: RecurringData) => {
    setIsSubmitting(true);

    if (isEdit) {
      console.log("Editing recurring:", data);
      if (initialData?.id) {
        onEdit(initialData.id, data);
      } else {
        console.error("No recurring ID found for editing");
      }
    } else {
      console.log("Adding new recurring:", data);
      onAdd(data);
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
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="50"
                  aria-label="Amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Coffee at Starbucks"
                  aria-label="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the account used" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNTS.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account.charAt(0).toUpperCase() + account.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="1"
                  aria-label="Due Date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
export default NewRecurring;
