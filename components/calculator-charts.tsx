"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { CalculatorInputs, CalculatorResults } from "@/components/calculator"

interface CalculatorChartsProps {
  results: CalculatorResults
  inputs: CalculatorInputs
}

export function CalculatorCharts({ results, inputs }: CalculatorChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Combine data for the chart
  const chartData = results.cdMonthlyBalances.map((cdData, index) => {
    const hysaData = results.hysaMonthlyBalances[index]
    const combinedData = results.combinedMonthlyBalances[index]
    return {
      month: cdData.month,
      CD: cdData.balance,
      HYSA: hysaData.balance,
      Combined: combinedData.balance,
    }
  })

  // Calculate the difference between balances for each month
  const differenceData = results.cdMonthlyBalances.map((cdData, index) => {
    const hysaData = results.hysaMonthlyBalances[index]
    const combinedData = results.combinedMonthlyBalances[index]
    return {
      month: cdData.month,
      "CD vs HYSA": cdData.balance - hysaData.balance,
      "Combined vs Best Individual": combinedData.balance - Math.max(cdData.balance, hysaData.balance),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balance">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balance">Balance Over Time</TabsTrigger>
            <TabsTrigger value="difference">Difference Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="balance" className="h-[350px] pt-4">
            <ChartContainer
              config={{
                CD: {
                  label: "CD",
                  color: "#0ea5e9",
                },
                HYSA: {
                  label: "HYSA",
                  color: "#38bdf8",
                },
                Combined: {
                  label: "Combined",
                  color: "#06b6d4",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    label={{ value: "Balance", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="CD"
                    stackId="1"
                    stroke="var(--color-CD)"
                    fill="var(--color-CD)"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="HYSA"
                    stackId="2"
                    stroke="var(--color-HYSA)"
                    fill="var(--color-HYSA)"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="Combined"
                    stackId="3"
                    stroke="var(--color-Combined)"
                    fill="var(--color-Combined)"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="difference" className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={differenceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                <YAxis
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  label={{ value: "Difference ($)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="CD vs HYSA"
                  name="CD vs HYSA"
                  stroke="#0ea5e9"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Combined vs Best Individual"
                  name="Combined Strategy Advantage"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={2}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
