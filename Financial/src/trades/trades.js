financial.trades = {};

financial.trades.CustomerWill = {
	BUY: "Buy",
	SELL: "Sell"
};

financial.trades.CashSettlement = function () {
	this.Amount = 0;
	this.Explanation = '';
};