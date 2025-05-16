"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalculatorForm } from "@/components/calculator-form"
import { CalculatorResults as ResultsDisplay } from "@/components/calculator-results"
import { CalculatorCharts } from "@/components/calculator-charts"
import { CalculatorComparison } from "@/components/calculator-comparison"

export type CalculatorInputs = {
  initialDepositCD: number
  initialDepositHYSA: number
  cdRate: number
  hysaRate: number
  termMonths: number
  cdCompoundingFrequency: string
  hysaCompoundingFrequency: string
  regularContribution: number
  contributionFrequency: string
}

export type CalculatorResults = {
  cdFinalBalance: number
  hysaFinalBalance: number
  combinedFinalBalance: number
  cdInterestEarned: number
  hysaInterestEarned: number
  combinedInterestEarned: number
  cdMonthlyBalances: { month: number; balance: number }[]
  hysaMonthlyBalances: { month: number; balance: number }[]
  combinedMonthlyBalances: { month: number; balance: number }[]
  totalContributions: number
  betterOption: "CD" | "HYSA" | "Combined" | "Equal"
  difference: number
}

export function Calculator() {
  const [activeTab, setActiveTab] = useState("inputs")
  const [results, setResults] = useState<CalculatorResults | null>(null)

  const defaultValues: CalculatorInputs = {
    initialDepositCD: 5000,
    initialDepositHYSA: 0,
    cdRate: 4.25,
    hysaRate: 4,
    termMonths: 12,
    cdCompoundingFrequency: "daily",
    hysaCompoundingFrequency: "daily",
    regularContribution: 250,
    contributionFrequency: "monthly",
  }

  const [inputs, setInputs] = useState<CalculatorInputs>(defaultValues)

  const calculateResults = (values: CalculatorInputs): CalculatorResults => {
    // Convert rates to decimal
    const cdRateDecimal = values.cdRate / 100
    const hysaRateDecimal = values.hysaRate / 100

    // Determine compounding periods per year
    const compoundingPeriodsMap: Record<string, number> = {
      daily: 365,
      monthly: 12,
      quarterly: 4,
      semiannually: 2,
      annually: 1,
    }

    // Determine contribution periods per month
    const contributionPeriodsMap: Record<string, number> = {
      weekly: 4.33, // Average weeks per month
      biweekly: 2.17, // Average bi-weeks per month
      monthly: 1,
      quarterly: 1 / 3, // Once every 3 months
    }

    const cdCompoundingPeriods = compoundingPeriodsMap[values.cdCompoundingFrequency]
    const hysaCompoundingPeriods = compoundingPeriodsMap[values.hysaCompoundingFrequency]
    const contributionsPerMonth = contributionPeriodsMap[values.contributionFrequency]

    // Calculate monthly balances for both CD and HYSA
    const cdMonthlyBalances: { month: number; balance: number }[] = []
    const hysaMonthlyBalances: { month: number; balance: number }[] = []
    const combinedMonthlyBalances: { month: number; balance: number }[] = []

    let cdBalance = values.initialDepositCD
    let hysaBalance = values.initialDepositHYSA
    let totalContributions = values.initialDepositCD + values.initialDepositHYSA

    // Calculate monthly balances
    for (let month = 1; month <= values.termMonths; month++) {
      // For CD - calculate one month's interest based on previous balance
      // This is the corrected approach: compound the previous month's balance
      const cdMonthlyRate = cdRateDecimal / 12
      const cdCompoundsPerMonth = cdCompoundingPeriods / 12

      // If compounding is more frequent than monthly (e.g., daily)
      if (cdCompoundsPerMonth > 1) {
        // Apply the compound interest formula for the specific compounding frequency
        cdBalance = cdBalance * Math.pow(1 + cdRateDecimal / cdCompoundingPeriods, cdCompoundsPerMonth)
      } else {
        // For monthly or less frequent compounding, check if this month is a compounding month
        const monthsPerCompound = 12 / cdCompoundingPeriods
        if (month % monthsPerCompound === 0) {
          // Apply interest for this compounding period
          cdBalance = cdBalance * (1 + cdRateDecimal / cdCompoundingPeriods)
        }
      }

      // For HYSA with regular contributions
      // Calculate contributions for this month
      const contributionThisMonth = values.regularContribution * contributionsPerMonth
      totalContributions += contributionThisMonth

      // First calculate interest on existing balance
      const hysaMonthlyRate = hysaRateDecimal / 12
      const hysaCompoundsPerMonth = hysaCompoundingPeriods / 12

      // If compounding is more frequent than monthly (e.g., daily)
      if (hysaCompoundsPerMonth > 1) {
        // Apply the compound interest formula for the specific compounding frequency
        hysaBalance = hysaBalance * Math.pow(1 + hysaRateDecimal / hysaCompoundingPeriods, hysaCompoundsPerMonth)
      } else {
        // For monthly or less frequent compounding, check if this month is a compounding month
        const monthsPerCompound = 12 / hysaCompoundingPeriods
        if (month % monthsPerCompound === 0) {
          // Apply interest for this compounding period
          hysaBalance = hysaBalance * (1 + hysaRateDecimal / hysaCompoundingPeriods)
        }
      }

      // Then add the contribution
      hysaBalance += contributionThisMonth

      cdMonthlyBalances.push({ month, balance: cdBalance })
      hysaMonthlyBalances.push({ month, balance: hysaBalance })
      combinedMonthlyBalances.push({ month, balance: cdBalance + hysaBalance })
    }

    // Final balances
    const cdFinalBalance = cdMonthlyBalances[cdMonthlyBalances.length - 1].balance
    const hysaFinalBalance = hysaMonthlyBalances[hysaMonthlyBalances.length - 1].balance
    const combinedFinalBalance = cdFinalBalance + hysaFinalBalance

    // Interest earned
    const cdInterestEarned = cdFinalBalance - values.initialDepositCD
    const hysaInterestEarned =
      hysaFinalBalance -
      values.initialDepositHYSA -
      values.regularContribution * contributionsPerMonth * values.termMonths
    const combinedInterestEarned = cdInterestEarned + hysaInterestEarned

    // Determine better option
    let betterOption: "CD" | "HYSA" | "Combined" | "Equal" = "Combined"
    let difference = 0

    if (cdFinalBalance > hysaFinalBalance + 0.01 && cdFinalBalance > combinedFinalBalance + 0.01) {
      betterOption = "CD"
      difference = cdFinalBalance - Math.max(hysaFinalBalance, combinedFinalBalance)
    } else if (hysaFinalBalance > cdFinalBalance + 0.01 && hysaFinalBalance > combinedFinalBalance + 0.01) {
      betterOption = "HYSA"
      difference = hysaFinalBalance - Math.max(cdFinalBalance, combinedFinalBalance)
    } else if (combinedFinalBalance > cdFinalBalance + 0.01 && combinedFinalBalance > hysaFinalBalance + 0.01) {
      betterOption = "Combined"
      difference = combinedFinalBalance - Math.max(cdFinalBalance, hysaFinalBalance)
    } else {
      betterOption = "Equal"
    }

    return {
      cdFinalBalance,
      hysaFinalBalance,
      combinedFinalBalance,
      cdInterestEarned,
      hysaInterestEarned,
      combinedInterestEarned,
      cdMonthlyBalances,
      hysaMonthlyBalances,
      combinedMonthlyBalances,
      totalContributions,
      betterOption,
      difference,
    }
  }

  const handleCalculate = (values: CalculatorInputs) => {
    setInputs(values)
    const calculatedResults = calculateResults(values)
    setResults(calculatedResults)
    setActiveTab("results")
  }

  const handleReset = () => {
    setInputs(defaultValues)
    setResults(null)
    setActiveTab("inputs")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-t-primary">
      <CardHeader className="gradient-bg text-white">
        <CardTitle className="text-2xl">CD vs HYSA Hybrid Calculator</CardTitle>
        <CardDescription className="text-white/90">
          Compare potential earnings between CD, HYSA, and a hybrid approach
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inputs">
            <CalculatorForm defaultValues={inputs} onCalculate={handleCalculate} />
          </TabsContent>
          <TabsContent value="results">
            {results && (
              <div className="space-y-8">
                <ResultsDisplay results={results} inputs={inputs} onReset={handleReset} />
                <CalculatorCharts results={results} inputs={inputs} />
                <CalculatorComparison results={results} inputs={inputs} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
