const Token = artifacts.require("Token");

describe("Token contract", function() {
  let accounts;
  let token;

  beforeEach(async function() {
    accounts = await web3.eth.getAccounts();
    token = await Token.new(
      "Zora",
      "ZORA",
      0,
      accounts[0],
      20,
      50
    )
  });

  it("redeems tokens", async function() {
    const messageHash = web3.utils.sha3("foobar")
    const res = await token.redeem(5, messageHash);
    assert.equal('TokenRedeemed', res.logs[1].event);
    assert.equal(accounts[0], res.logs[1].args.redeemer)
    assert.equal(5, res.logs[1].args.amount)
    assert.equal(messageHash, res.logs[1].args.messageHash)

    const bal = await token.balanceOf(accounts[0])
    assert.equal(15, bal)
  })

  it("cannot redeem over its balance", async function() {
    try {
      await token.redeem(21, web3.utils.sha3("foobar"));
      assert(false)
    } catch (err) {
      if (err.name === 'AssertionError') {
        throw err;
      }
    }
  })

  it("mints tokens", async function() {
    await token.mint(accounts[1], 5)

    const bal = await token.balanceOf(accounts[1])
    assert.equal(5, bal)
  })

  it("cannot mint if not the minter", async function() {
    try {
      await token.mint(accounts[1], 5, {from: accounts[1]})
      assert(false)
    } catch (err) {
      if (err.name === 'AssertionError') {
        throw err;
      }
    }
  })

  it("burns tokens", async function() {
    await token.burn(5)

    const bal = await token.balanceOf(accounts[0])
    assert.equal(15, bal)
  })

  it("pauses tokens", async function() {
    await token.pause();

    try {
      await token.transfer(accounts[1], 5);
      assert(false, "Cannot transfer when paused")
    } catch (err) {
      if (err.name === 'AssertionError') {
        throw err;
      }
    }

    await token.unpause();

    await token.transfer(accounts[1], 5);
  })

  it("cannot mint tokens over the supply cap", async function() {
    try {
      await token.mint(accounts[0], 50);
      assert(false, "Cannot mint over the supply cap")
    } catch (err) {
      if (err.name === 'AssertionError') {
        throw err;
      }
    }
  })

  it("does not have a supply cap when 0", async function() {
    token = await Token.new(
      "Zora",
      "ZORA",
      0,
      accounts[0],
      20,
      0
    )

    await token.mint(accounts[0], 50);
  })
});
