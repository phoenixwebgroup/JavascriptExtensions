describe("Option", function () {
	it("determine in the money", function () {
		var option = new financial.trades.Option();
		option.Strike = 2;
		option.CustomerWill = financial.trades.CustomerWill.BUY;
		option.OptionTo = financial.trades.OptionTo.PUT;

		expect(option.IsItm(1))
						.toBe(true);
		expect(option.IsItm(2))
						.toBe(false);
		expect(option.IsItm(3))
						.toBe(false);

		option.OptionTo = financial.trades.OptionTo.CALL;

		expect(option.IsItm(1))
						.toBe(false);
		expect(option.IsItm(2))
						.toBe(false);
		expect(option.IsItm(3))
						.toBe(true);

	});

	describe("GetCashSettlement", function () {
		var option = new financial.trades.Option();

		beforeEach(function () {
			option.Strike = 2;
			option.Quantity = 1000;
		});

		describe(" for puts ", function () {

			beforeEach(function () {
				option.OptionTo = financial.trades.OptionTo.PUT;
			});

			it("should be worthless when not in the money", function () {
				option.CustomerWill = financial.trades.CustomerWill.BUY;

				at(option.Strike + 1,
					{
						Amount: 0,
						Explanation: "Option is not in the money"
					});

				at(2,
					{
						Amount: 0,
						Explanation: "Option is not in the money"
					});
			});

			it("should be calculated when in the money", function () {
				at(1,
					{
						Amount: 1000,
						Explanation: "(Strike - Settlement Price) * Quantity = (2 - 1) * 1000"
					});

				option.CustomerWill = financial.trades.CustomerWill.SELL;
				at(1,
					{
						Amount: -1000,
						Explanation: "-(Strike - Settlement Price) * Quantity = -(2 - 1) * 1000"
					});
			});
		});

		it("should work for calls", function () {
			option.CustomerWill = financial.trades.CustomerWill.BUY;
			option.OptionTo = financial.trades.OptionTo.CALL;

			at(1,
				{
					Amount: 0,
					Explanation: "Option is not in the money"
				});

			at(2,
				{
					Amount: 0,
					Explanation: "Option is not in the money"
				});

			at(3,
				{
					Amount: 1000,
					Explanation: "(Settlement Price - Strike) * Quantity = (3 - 2) * 1000"
				});

			option.CustomerWill = financial.trades.CustomerWill.SELL;
			at(3,
				{
					Amount: -1000,
					Explanation: "-(Settlement Price - Strike) * Quantity = -(3 - 2) * 1000"
				});
		});

		var at = function (settlementPrice, result) {
			var settlement = option.GetCashSettlement(settlementPrice);
			expect(settlement).toEqual(result);
		};
	});
});