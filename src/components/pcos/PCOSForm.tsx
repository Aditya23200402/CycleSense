import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schema with validation
const formSchema = z.object({
  // Basic info
  Period_Length: z.coerce.number().min(1).max(15),
  Cycle_Length: z.coerce.number().min(20).max(40),
  Age: z.coerce.number().min(14).max(60),
  
  // Physical symptoms
  Overweight: z.coerce.number().min(0).max(1),
  loss_weight_gain_weight_loss: z.coerce.number().min(0).max(1),
  
  // Menstrual symptoms
  irregular_or_missed_periods: z.coerce.number().min(0).max(1),
  Difficulty_in_conceiving: z.coerce.number().min(0).max(1),
  
  // Hair-related symptoms
  Hair_growth_on_Chin: z.coerce.number().min(0).max(1),
  Hair_growth_on_Cheeks: z.coerce.number().min(0).max(1),
  Hair_growth_Between_breasts: z.coerce.number().min(0).max(1),
  Hair_growth_on_Upper_lips: z.coerce.number().min(0).max(1),
  Hair_growth_in_Arms: z.coerce.number().min(0).max(1),
  Hair_growth_on_Inner_thighs: z.coerce.number().min(0).max(1),
  Hair_thinning_or_hair_loss: z.coerce.number().min(0).max(1),
  
  // Skin symptoms
  Acne_or_skin_tags: z.coerce.number().min(0).max(1),
  Dark_patches: z.coerce.number().min(0).max(1),
  
  // Other symptoms
  always_tired: z.coerce.number().min(0).max(1),
  more_Mood_Swings: z.coerce.number().min(0).max(1),
  
  // Lifestyle factors
  exercise_per_week: z.coerce.number().min(0).max(7),
  eat_outside_per_week: z.coerce.number().min(0).max(7),
  canned_food_often: z.coerce.number().min(0).max(1),
  relocated_city: z.coerce.number().min(0).max(1),
});

interface PCOSFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function PCOSForm({ onSubmit }: PCOSFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Period_Length: 5,
      Cycle_Length: 28,
      Age: 25,
      Overweight: 0,
      loss_weight_gain_weight_loss: 0,
      irregular_or_missed_periods: 0,
      Difficulty_in_conceiving: 0,
      Hair_growth_on_Chin: 0,
      Hair_growth_on_Cheeks: 0,
      Hair_growth_Between_breasts: 0,
      Hair_growth_on_Upper_lips: 0,
      Hair_growth_in_Arms: 0,
      Hair_growth_on_Inner_thighs: 0,
      Hair_thinning_or_hair_loss: 0,
      Acne_or_skin_tags: 0,
      Dark_patches: 0,
      always_tired: 0,
      more_Mood_Swings: 0,
      exercise_per_week: 2,
      eat_outside_per_week: 2,
      canned_food_often: 0,
      relocated_city: 0,
    },
  });

  // Form submission handler
  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    
    // Ensure field names match exactly what the backend expects
    const formattedValues = {
      ...values,
      // Convert to the exact format expected by the backend
      Period_Length: values.Period_Length,
      Cycle_Length: values.Cycle_Length,
      Age: values.Age,
      loss_weight_gain_weight_loss: values.loss_weight_gain_weight_loss
      // All other fields should already match
    };
    
    console.log("Formatted values for API:", formattedValues);
    onSubmit(formattedValues);
  }

  // Tab navigation helpers
  const navigateToNextTab = () => {
    if (activeTab === "basic") setActiveTab("physical");
    else if (activeTab === "physical") setActiveTab("hormonal");
    else if (activeTab === "hormonal") setActiveTab("lifestyle");
  };

  const navigateToPrevTab = () => {
    if (activeTab === "lifestyle") setActiveTab("hormonal");
    else if (activeTab === "hormonal") setActiveTab("physical");
    else if (activeTab === "physical") setActiveTab("basic");
  };

  // Binary option component for yes/no fields
  const BinaryOption = ({ 
    name, 
    label, 
    description 
  }: { 
    name: keyof z.infer<typeof formSchema>, 
    label: string,
    description?: string
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value.toString()}
              className="flex space-x-4"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="0" />
                </FormControl>
                <FormLabel className="font-normal">No</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="1" />
                </FormControl>
                <FormLabel className="font-normal">Yes</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="physical">Physical Symptoms</TabsTrigger>
            <TabsTrigger value="hormonal">Hormonal Symptoms</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Please provide basic details about your menstrual cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="Age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={14} max={60} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Period_Length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Period Length (days)</FormLabel>
                      <FormDescription>
                        The average number of days your period lasts
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} min={1} max={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="Cycle_Length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Cycle Length (days)</FormLabel>
                      <FormDescription>
                        The average number of days between the start of one period and the start of the next
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} min={20} max={40} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={navigateToNextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Physical Symptoms Tab */}
          <TabsContent value="physical">
            <Card>
              <CardHeader>
                <CardTitle>Physical Symptoms</CardTitle>
                <CardDescription>
                  Please indicate if you experience any of these physical symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <BinaryOption 
                  name="Overweight" 
                  label="Are you overweight?" 
                  description="Based on BMI or clinical assessment"
                />
                
                <BinaryOption 
                  name="loss_weight_gain_weight_loss" 
                  label="Have you experienced unexpected weight changes?" 
                  description="Unexplained weight gain or difficulty losing weight"
                />
                
                <BinaryOption 
                  name="irregular_or_missed_periods" 
                  label="Do you have irregular or missed periods?"
                />
                
                <BinaryOption 
                  name="Difficulty_in_conceiving" 
                  label="Have you experienced difficulty in conceiving?" 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={navigateToPrevTab}>Previous</Button>
                <Button type="button" onClick={navigateToNextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Hormonal Symptoms Tab */}
          <TabsContent value="hormonal">
            <Card>
              <CardHeader>
                <CardTitle>Hormonal Symptoms</CardTitle>
                <CardDescription>
                  Please indicate if you experience any of these hormonal symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BinaryOption name="Hair_growth_on_Chin" label="Hair growth on Chin" />
                  <BinaryOption name="Hair_growth_on_Cheeks" label="Hair growth on Cheeks" />
                  <BinaryOption name="Hair_growth_Between_breasts" label="Hair growth Between breasts" />
                  <BinaryOption name="Hair_growth_on_Upper_lips" label="Hair growth on Upper lips" />
                  <BinaryOption name="Hair_growth_in_Arms" label="Excessive hair growth on Arms" />
                  <BinaryOption name="Hair_growth_on_Inner_thighs" label="Hair growth on Inner thighs" />
                  <BinaryOption name="Hair_thinning_or_hair_loss" label="Hair thinning or hair loss" />
                  <BinaryOption name="Acne_or_skin_tags" label="Acne or skin tags" />
                  <BinaryOption name="Dark_patches" label="Dark patches on skin" />
                  <BinaryOption name="always_tired" label="Always feeling tired" />
                  <BinaryOption name="more_Mood_Swings" label="Experience more mood swings" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={navigateToPrevTab}>Previous</Button>
                <Button type="button" onClick={navigateToNextTab}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Factors</CardTitle>
                <CardDescription>
                  Please share some information about your lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="exercise_per_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise sessions per week</FormLabel>
                      <FormDescription>
                        How many times do you exercise (30+ mins) in a typical week?
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} min={0} max={7} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eat_outside_per_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eating out frequency</FormLabel>
                      <FormDescription>
                        How many times do you eat out or order in during a typical week?
                      </FormDescription>
                      <FormControl>
                        <Input type="number" {...field} min={0} max={7} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <BinaryOption 
                  name="canned_food_often" 
                  label="Do you consume canned or processed food often?" 
                />
                
                <BinaryOption 
                  name="relocated_city" 
                  label="Have you relocated to a new city in the past year?" 
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={navigateToPrevTab}>Previous</Button>
                <Button type="submit" className="bg-cycle-purple hover:bg-cycle-purple-dark">
                  Get Assessment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
} 