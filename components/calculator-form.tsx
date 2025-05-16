"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalculatorInputs } from "@/components/calculator"

const formSchema = z.object({
  initialDepositCD: z.coerce.number().min(0, "Deposit must be non-negative"),
  initialDepositHYSA: z.coerce.number().min(0, "Deposit must be non-negative"),
  cdRate: z.coerce.number().min(0, "Rate must be positive"),
  hysaRate: z.coerce.number().min(0, "Rate must be positive"),
  termMonths: z.coerce.number().int().positive("Term must be positive"),
  cdCompoundingFrequency: z.string(),
  hysaCompoundingFrequency: z.string(),
  regularContribution: z.coerce.number().min(0, "Contribution must be non-negative"),
  contributionFrequency: z.string(),
})

interface CalculatorFormProps {
  defaultValues: CalculatorInputs
  onCalculate: (values: CalculatorInputs) => void
}

export function CalculatorForm({ defaultValues, onCalculate }: CalculatorFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate(values as CalculatorInputs)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Term Length - Top Section */}
        <div className="p-4 border rounded-md bg-gradient-to-r from-cd-light/10 to-hysa-light/10">
          <FormField
            control={form.control}
            name="termMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">Term Length (Months)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="max-w-[200px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Main Sections - CD and HYSA side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CD Section */}
          <div className="space-y-4">
            <div className="p-4 border rounded-md space-y-4 cd-card">
              <h3 className="font-medium text-cd text-lg">Certificate of Deposit (CD)</h3>
              <p className="text-xs text-muted-foreground">
                Note: This calculator assumes CDs are held to maturity without early withdrawals.
              </p>

              <FormField
                control={form.control}
                name="initialDepositCD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Deposit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cdRate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>CD APY (%)</FormLabel>
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Fixed</span>
                    </div>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      CD rates are typically fixed for the entire term.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cdCompoundingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semiannually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* HYSA Section */}
          <div className="space-y-4">
            <div className="p-4 border rounded-md space-y-4 hysa-card">
              <h3 className="font-medium text-hysa text-lg">High Yield Savings Account (HYSA)</h3>

              <FormField
                control={form.control}
                name="initialDepositHYSA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Deposit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hysaRate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>HYSA APY (%)</FormLabel>
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">Variable</span>
                    </div>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: HYSA rates are variable and subject to change over time. This calculator uses a fixed rate
                      for simplicity.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hysaCompoundingFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semiannually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Regular Contributions Section */}
        <div className="p-4 border rounded-md space-y-4 combined-card">
          <h3 className="font-medium text-combined text-lg">Regular Contributions to HYSA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="regularContribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribution Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contributionFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-cd to-hysa hover:opacity-90 transition-opacity">
          Calculate
        </Button>
      </form>
    </Form>
  )
}
