import { ApiUser } from "@/lib/redux/api/users"
import { useMemo } from "react"

function ngn(n: number | string | null | undefined) {
  const v = Number(n ?? 0)
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(v) ? v : 0)
}

export function WalletCard({
  user,
  isLoading,
  isError,
  onRetry,
}: {
  user?: ApiUser
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}) {
  // Try a few common backend shapes for wallet-like data
  const wallet = useMemo(() => {
    const u: any = user ?? {}
    return (
      u.wallet ??
      u.account ??
      u.balance ??
      u.financials ?? {
        balance: 0,
        bank_name: "—",
        account_number: "",
        provider: "—",
      }
    )
  }, [user])

  const provider: string =
    (wallet.provider as string) ||
    (wallet.gateway as string) ||
    (wallet.bank_name ? "Bank" : "Wallet")

  const bankName: string =
    (wallet.bank_name as string) ||
    (wallet.bank as string) ||
    (wallet.bank_details?.name as string) ||
    "—"

  const accountNumber: string =
    (wallet.account_number as string) ||
    (wallet.bank_details?.account_number as string) ||
    ""

  const balance = wallet.available_balance ?? wallet.balance ?? 0
  const mask = (s: string) =>
    s && s.length > 4 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s
  return (
    <div
      className="w-full h-full xl:h-[148px] xl:w-[319px] flex flex-col justify-between gap-6 p-5 relative bg-[#1B0D2D] rounded-[12px]"
      style={{ backgroundImage: `url(/images/merchants/wallet-card.svg)` }}
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="w-[213px] h-[25px] rounded-3xl bg-white/20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-8 w-40 bg-white/30 rounded animate-pulse" />
          </div>
        </div>
      ) : isError ? (
        <div className="text-white">
          <p className="text-sm/6 opacity-90">Failed to load wallet.</p>
          <button
            onClick={onRetry}
            className="mt-2 underline text-sm text-purple-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="w-[213px] h-[25px] flex items-center px-3 py-1 rounded-3xl bg-[#F7F6FC]/50 gap-1 font-figtree font-medium text-[#F7F6FC] text-[14px]/[120%] tracking-normal">
            {provider || "Wallet"} <span>&bull;</span>{" "}
            <span className="font-bold">
              {accountNumber ? mask(accountNumber) : "—"}
            </span>
          </div>
          <div className="w-full flex flex-col gap-1">
            <h4 className="font-normal font-figtree text-[14px]/[120%] text-[#BDBDBD] tracking-normal">
              {bankName && bankName !== "—" ? bankName : "Wallet Balance"}
            </h4>
            <p className="font-bold font-figtree text-[36px]/[120%] text-[#FFFFFF] tracking-normal">
              {ngn(balance)}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
