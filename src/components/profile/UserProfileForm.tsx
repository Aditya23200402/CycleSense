
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCycleContext } from "@/context/CycleContext";
import { format, parse, parseISO, subYears } from "date-fns";
import { toast } from "@/components/ui/sonner";

const userProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  birthdate: z.string().optional().refine((date) => {
    if (!date) return true;
    try {
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      const minDate = subYears(new Date(), 80);
      const maxDate = subYears(new Date(), 10);
      return parsedDate >= minDate && parsedDate <= maxDate;
    } catch {
      return false;
    }
  }, { message: "Please enter a valid date of birth (between 10 and 80 years ago)" }),
  height: z.string().optional().refine((height) => {
    if (!height) return true;
    const num = parseFloat(height);
    return !isNaN(num) && num > 0 && num < 300;
  }, { message: "Please enter a valid height in cm (1-300)" }),
  weight: z.string().optional().refine((weight) => {
    if (!weight) return true;
    const num = parseFloat(weight);
    return !isNaN(num) && num > 0 && num < 500;
  }, { message: "Please enter a valid weight in kg (1-500)" }),
});

export const UserProfileForm = () => {
  const { userProfile, updateUserProfile, isLoading } = useCycleContext();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: userProfile.name || "",
      birthdate: userProfile.birthdate || "",
      height: userProfile.height ? userProfile.height.toString() : "",
      weight: userProfile.weight ? userProfile.weight.toString() : "",
    },
  });
  
  // Update form when userProfile changes
  useEffect(() => {
    form.reset({
      name: userProfile.name || "",
      birthdate: userProfile.birthdate || "",
      height: userProfile.height ? userProfile.height.toString() : "",
      weight: userProfile.weight ? userProfile.weight.toString() : "",
    });
  }, [userProfile, form]);
  
  const onSubmit = async (data: z.infer<typeof userProfileSchema>) => {
    setIsSaving(true);
    
    const updates = {
      name: data.name,
      birthdate: data.birthdate,
      height: data.height ? parseFloat(data.height) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
    };
    
    await updateUserProfile(updates);
    setIsSaving(false);
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Your age helps us provide more accurate predictions and insights.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-cycle-purple hover:bg-cycle-purple-dark"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="mt-6 border-t pt-6">
        <h3 className="text-md font-medium mb-4">Cycle Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Average Cycle Length</p>
            <p className="text-lg font-medium">
              {userProfile.cycleAverageLength ? `${userProfile.cycleAverageLength} days` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Period Length</p>
            <p className="text-lg font-medium">
              {userProfile.periodAverageLength ? `${userProfile.periodAverageLength} days` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-lg font-medium">
              {userProfile.lastUpdated ? format(parseISO(userProfile.lastUpdated), 'MMM d, yyyy') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
