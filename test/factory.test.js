const TokenFactory = artifacts.require("TokenFactory");

describe("TokenFactory contract", function() {
  let accounts;

  before(async function() {
    accounts = await web3.eth.getAccounts();
  });

  it("deploys tokens", async function() {
    const tokenFactory = await TokenFactory.new();
    assert.isNotNull(tokenFactory.address);

    const token = await tokenFactory.createToken(
      "Zora",
      "ZORA",
      0,
      accounts[0],
      20,
      50
    )

    assert.isNotNull(token.address);
  });
});
