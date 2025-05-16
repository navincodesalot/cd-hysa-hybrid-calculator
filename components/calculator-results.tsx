"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CalculatorInputs, CalculatorResults as CalculatorResultsType } from "@/components/calculator"

interface CalculatorResultsProps {
  results: CalculatorResultsType
  inputs: CalculatorInputs
  onReset: () => void
}

export function CalculatorResults({ results, inputs, onReset }: CalculatorResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate / 100)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`cd-card ${results.betterOption === "CD" ? "ring-2 ring-cd" : ""}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-cd">Certificate of Deposit</h3>
              {results.betterOption === "CD" && <CheckCircle2 className="h-5 w-5 text-cd" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial Deposit:</span>
                <span>{formatCurrency(inputs.initialDepositCD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APY:</span>
                <span>{formatPercentage(inputs.cdRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compounding:</span>
                <span className="capitalize">{inputs.cdCompoundingFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Earned:</span>
                <span className="font-medium">{formatCurrency(results.cdInterestEarned)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Final Balance:</span>
                <span className="font-bold">{formatCurrency(results.cdFinalBalance)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`hysa-card ${results.betterOption === "HYSA" ? "ring-2 ring-hysa" : ""}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-hysa">High Yield Savings</h3>
              {results.betterOption === "HYSA" && <CheckCircle2 className="h-5 w-5 text-hysa" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Initial Deposit:</span>
                <span>{formatCurrency(inputs.initialDepositHYSA)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regular Contribution:</span>
                <span>
                  {formatCurrency(inputs.regularContribution)} ({inputs.contributionFrequency})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">APY:</span>
                <span>{formatPercentage(inputs.hysaRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compounding:</span>
                <span className="capitalize">{inputs.hysaCompoundingFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Earned:</span>
                <span className="font-medium">{formatCurrency(results.hysaInterestEarned)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Final Balance:</span>
                <span className="font-bold">{formatCurrency(results.hysaFinalBalance)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`combined-card ${results.betterOption === "Combined" ? "ring-2 ring-combined" : ""}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-combined">Combined Strategy</h3>
              {results.betterOption === "Combined" && <CheckCircle2 className="h-5 w-5 text-combined" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Initial Deposit:</span>
                <span>{formatCurrency(inputs.initialDepositCD + inputs.initialDepositHYSA)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Contributions:</span>
                <span>{formatCurrency(results.totalContributions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CD Balance:</span>
                <span>{formatCurrency(results.cdFinalBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HYSA Balance:</span>
                <span>{formatCurrency(results.hysaFinalBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest Earned:</span>
                <span className="font-medium">{formatCurrency(results.combinedInterestEarned)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Combined Final Balance:</span>
                <span className="font-bold">{formatCurrency(results.combinedFinalBalance)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Best Strategy</p>
            <p className="text-lg font-bold">
              {results.betterOption === "Equal" ? "Equal Returns" : `${results.betterOption}`}
            </p>
          </div>

          {results.betterOption !== "Equal" && (
            <>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Additional Earnings</p>
                <p className="text-lg font-bold">{formatCurrency(results.difference)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset}>
          Reset Calculator
        </Button>
      </div>
    </div>
  )
}
