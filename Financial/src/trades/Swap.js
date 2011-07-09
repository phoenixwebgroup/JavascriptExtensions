financial.trades.Swap = function () {
	this.CustomerWill = financial.trades.CustomerWill.BUY;
	this.FixedPrice = 2.00;
	this.Quantity = 10000;

	var swap = this;

	this.GetCashSettlement = function (settlementPrice) {
		var settlement = new financial.trades.CashSettlement();
		if (settlementPrice == swap.FixedPrice) {
			settlement.Amount = 0;
			settlement.Explanation = 'Bought and sold at same price';
			return settlement;
		}
		var initiallyLong = swap.CustomerWill == financial.trades.CustomerWill.BUY;
		var soldAt = initiallyLong ? settlementPrice : swap.FixedPrice;
		var boughtAt = initiallyLong ? swap.FixedPrice : settlementPrice;

		settlement.Amount = (soldAt - boughtAt) * swap.Quantity;
		settlement.Explanation = '(Sold At - Bought At) * Quantity = (' + soldAt + ' - ' + boughtAt + ') * ' + swap.Quantity;
		return settlement;
	};
}