
export interface PatternReturnItem {
  year: number;
  return: number;
}

export interface MiscMetrics {
  trades: number;
  calendar_days: number | null;
  std_dev: number;
  sortino_ratio: number;
  sharpe_ratio: number;
  volatility: number;
  current_streak: number;
  gains: number;
}

export interface TradeStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_pct: number;
  loss_pct: number;
}
