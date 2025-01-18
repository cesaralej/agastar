import { useState, useEffect } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import { categories, CategoryType } from "@/data/categoriesv2";
import { ACCOUNTS, TYPES, Transaction, TransactionData } from "@/types";
const categoryNames = categories.map((category) => category.name);

const schema = z.object({
  amount: z
    .string()
    .min(1, "cannot be empty")
    .default("")
    .refine((val) => !isNaN(Number(val)), { message: "Invalid amount" }),
  description: z.string(),
  type: z.enum(TYPES),
  account: z.enum(ACCOUNTS),
  category: z.enum(categoryNames as [CategoryType, ...CategoryType[]]),
  date: z.date(),
  effectiveDate: z.date().optional(),
  time: z.string(),
  isCreditCardPayment: z.boolean(),
  comment: z.string().optional(),
});

const mergeDateAndTime = (date: Date, time: string) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  const dateTime = new Date(`${dateString}T${time}:00`);
  return dateTime;
};

const NewTransaction = ({
  setShowSheet,
  initialData = null,
  isEdit = false,
}: {
  setShowSheet: (show: boolean) => void;
  initialData?: Partial<Transaction> | null;
  isEdit?: boolean;
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const form = useForm<TransactionData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || undefined,
      description: initialData?.description || "",
      type: initialData?.type || "expense",
      account: initialData?.account || "credit",
      category: initialData?.category || "luxury",
      date: initialData?.date || new Date(),
      effectiveDate: initialData?.effectiveDate || new Date(),
      time: initialData?.time || format(new Date(), "HH:mm"),
      isCreditCardPayment: initialData?.isCreditCardPayment || false,
      comment: initialData?.comment || "",
    },
  });

  if (initialData) {
    console.log("Initial data:", initialData);
  }

  const isCreditCardPayment = form.watch("isCreditCardPayment");

  useEffect(() => {
    if (isCreditCardPayment) {
      form.setValue("description", "Credit Card", { shouldDirty: true });
      form.setValue("type", "expense", { shouldDirty: true });
      form.setValue("account", "savings", { shouldDirty: true });
      form.setValue("category", "other", { shouldDirty: true });
    } else {
      // Checkbox is being unchecked
      if (form.getValues("description") === "Credit Card") {
        form.setValue("description", ""); // Remove " - Credit Card" or "Credit Card"
      }
    }
  }, [isCreditCardPayment, form]);

  const type = form.watch("type");

  const filteredCategories =
    type === "income"
      ? categories.filter(
          (category) => category.name === "salary" || category.name === "other"
        )
      : categories.filter((category) => category.name !== "salary");

  useEffect(() => {
    if (type === "income") {
      form.setValue("account", "savings"); // Set account to "savings"
      form.setValue("category", "salary"); // Set category to "salary"
    } else if (type === "expense" && !isEdit) {
      form.setValue("account", "credit"); // Reset to default for "expense"
      form.setValue("category", "luxury"); // Reset to default for "expense"
    }
  }, [type, form, isEdit]);

  //check date
  useEffect(() => {
    console.log("Date:", form.getValues("date"));
  }, [form]);

  const handleSubmit = async (data: TransactionData) => {
    setIsSubmitting(true);

    data.amount = Number(data.amount);
    const dateTime = mergeDateAndTime(data.date, data.time);
    data.date = dateTime;

    if (isEdit) {
      console.log("Editing transaction:", data);
      if (initialData?.id) {
        try {
          await updateTransaction(initialData.id, data);
          toast({
            description: "Transaction updated",
          });
        } catch (error) {
          console.error("Error updating transaction:", error);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
          });
        }
      } else {
        console.error("No transaction ID found for editing");
      }
    } else {
      console.log("Adding new transaction:", data);
      console.log("Date:", data.date);
      try {
        await addTransaction(data);
        toast({
          description: "Transaction added",
        });
      } catch (error) {
        console.error("Error adding transaction:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
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
        {!isCreditCardPayment && (
          <>
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
                      disabled={isCreditCardPayment}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isCreditCardPayment}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of transaction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
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
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isCreditCardPayment}
                  >
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isCreditCardPayment}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name.charAt(0).toUpperCase() +
                            category.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEdit && (
          <>
            <FormField
              control={form.control}
              name="effectiveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Effective Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="w-[240px]"
                      aria-label="Time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments" : "Add Comments"}
        </Button>
        {showComments && (
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    aria-label="Comment"
                    placeholder="Add any details here."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="isCreditCardPayment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="grid gap-1.5 leading-none">
                <FormLabel
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Credit Card Payment
                </FormLabel>
              </div>
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
export default NewTransaction;
