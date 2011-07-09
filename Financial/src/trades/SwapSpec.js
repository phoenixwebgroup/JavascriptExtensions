describe("financial.trades.Swap", function () {

	describe("GetCashSettlement", function () {
		var swap = new financial.trades.Swap();

		beforeEach(function () {
			swap.FixedPrice = 2;
			swap.Quantity = 1000;
		});

		describe("buy initially", function () {

			beforeEach(function () {
				swap.CustomerWill = financial.trades.CustomerWill.BUY;
			});

			it("should be worthless when the settlement price is equal to the fixed price", function () {

				var settlement = swap.GetCashSettlement(swap.FixedPrice);

				expect(settlement).toEqual({
					Amount: 0,
					Explanation: 'Bought and sold at same price'
				});
			});

			it("should be a gain if the market goes up", function () {
				var settlement = swap.GetCashSettlement(swap.FixedPrice + 1);

				expect(settlement).toEqual({
					Amount: 1000,
					Explanation: '(Sold At - Bought At) * Quantity = (3 - 2) * 1000'
				});
			});

			it("should be a loss if the market goes down", function () {
				var settlement = swap.GetCashSettlement(swap.FixedPrice - 1);

				expect(settlement).toEqual({
					Amount: -1000,
					Explanation: '(Sold At - Bought At) * Quantity = (1 - 2) * 1000'
				});
			});
		});

		describe("sell initially", function () {

			beforeEach(function () {
				swap.CustomerWill = financial.trades.CustomerWill.SELL;
			});

			it("should be worthless when the settlement price is equal to the fixed price", function () {

				var settlement = swap.GetCashSettlement(swap.FixedPrice);

				expect(settlement).toEqual({
					Amount: 0,
					Explanation: 'Bought and sold at same price'
				});
			});

			it("should be a gain if the market goes down", function () {
				var settlement = swap.GetCashSettlement(swap.FixedPrice - 1);

				expect(settlement).toEqual({
					Amount: 1000,
					Explanation: '(Sold At - Bought At) * Quantity = (2 - 1) * 1000'
				});
			});

			it("should be a loss if the market goes up", function () {
				var settlement = swap.GetCashSettlement(swap.FixedPrice + 1);

				expect(settlement).toEqual({
					Amount: -1000,
					Explanation: '(Sold At - Bought At) * Quantity = (2 - 3) * 1000'
				});
			});
		});
	});
});