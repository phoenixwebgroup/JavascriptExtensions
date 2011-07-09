financial.trades.OptionTo = {
	CALL: "Call",
	PUT: "Put"
};

financial.trades.Option = function () {
	this.Strike = 10.00;
	this.OptionTo = financial.trades.OptionTo.PUT;
	this.CustomerWill = financial.trades.CustomerWill.BUY;
	this.Premium = 0.10;
	this.Quantity = 10000;
	this.Underlier = {};

	this.IsItm = function (settlementPrice) {
		if (this.OptionTo == financial.trades.OptionTo.PUT) {
			return settlementPrice < this.Strike;
		}
		return settlementPrice > this.Strike;
	} .bind(this);

	this.GetCashSettlement = function (settlementPrice) {
		var settlement = new financial.trades.CashSettlement();
		if (!this.IsItm(settlementPrice)) {
			settlement.Amount = 0;
			settlement.Explanation = "Option is not in the money";
			return settlement;
		}

		settlement.Amount = Math.abs(this.Strike - settlementPrice) * this.Quantity;

		if (this.OptionTo == financial.trades.OptionTo.PUT) {
			settlement.Explanation = '(Strike - Settlement Price) * Quantity = (' + this.Strike + ' - ' + settlementPrice + ') * ' + this.Quantity;
		}
		else {
			settlement.Explanation = '(Settlement Price - Strike) * Quantity = (' + settlementPrice + ' - ' + this.Strike + ') * ' + this.Quantity;
		}

		if (this.CustomerWill == financial.trades.CustomerWill.SELL) {
			settlement.Amount = -settlement.Amount;
			settlement.Explanation = settlement.Explanation.replace(/\(/gi, '-(');
		}

		return settlement;
	} .bind(this);
};
