import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CalculatorInputs, CalculatorResults } from "@/components/calculator"

interface CalculatorComparisonProps {
  results: CalculatorResults
  inputs: CalculatorInputs
}

export function CalculatorComparison({ results, inputs }: CalculatorComparisonProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Update the createComparisonData function to remove early withdrawal related logic
  const createComparisonData = () => {
    const data = []
    const termLength = inputs.termMonths

    // Determine intervals based on term length
    let intervals = [
      Math.ceil(termLength / 6),
      Math.ceil(termLength / 3),
      Math.ceil(termLength / 2),
      Math.ceil((2 * termLength) / 3),
      termLength,
    ]

    // Sort intervals and remove duplicates
    intervals = [...new Set(intervals)].sort((a, b) => a - b)

    // Get data for each interval
    intervals.forEach((month) => {
      if (month <= termLength) {
        const cdData = results.cdMonthlyBalances.find((data) => data.month === month)
        const hysaData = results.hysaMonthlyBalances.find((data) => data.month === month)
        const combinedData = results.combinedMonthlyBalances.find((data) => data.month === month)

        if (cdData && hysaData && combinedData) {
          let bestOption = "Equal"

          if (cdData.balance > hysaData.balance && cdData.balance > combinedData.balance) {
            bestOption = "CD"
          } else if (hysaData.balance > cdData.balance && hysaData.balance > combinedData.balance) {
            bestOption = "HYSA"
          } else if (combinedData.balance > cdData.balance && combinedData.balance > hysaData.balance) {
            bestOption = "Combined"
          }

          data.push({
            month,
            cdBalance: cdData.balance,
            hysaBalance: hysaData.balance,
            combinedBalance: combinedData.balance,
            bestOption,
          })
        }
      }
    })

    return data
  }

  const comparisonData = createComparisonData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>CD Balance</TableHead>
                <TableHead>HYSA Balance</TableHead>
                <TableHead>Combined Balance</TableHead>
                <TableHead>Best Option</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell className={data.bestOption === "CD" ? "font-bold text-cd" : ""}>
                    {formatCurrency(data.cdBalance)}
                  </TableCell>
                  <TableCell className={data.bestOption === "HYSA" ? "font-bold text-hysa" : ""}>
                    {formatCurrency(data.hysaBalance)}
                  </TableCell>
                  <TableCell className={data.bestOption === "Combined" ? "font-bold text-combined" : ""}>
                    {formatCurrency(data.combinedBalance)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        data.bestOption === "CD"
                          ? "bg-cd/10 text-cd"
                          : data.bestOption === "HYSA"
                            ? "bg-hysa/10 text-hysa"
                            : data.bestOption === "Combined"
                              ? "bg-combined/10 text-combined"
                              : "bg-gray-100"
                      }`}
                    >
                      {data.bestOption}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
