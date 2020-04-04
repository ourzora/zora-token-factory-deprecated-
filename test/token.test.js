const sigUtil = require('eth-sig-util');
const {
  fromRpcSig,
  privateToAddress,
  toChecksumAddress,
  bufferToHex
} = require("ethereumjs-util");

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

  describe("permit()", function() {
    let addressToPrivateKey

    beforeEach(async function() {
      token = await Token.new(
        "Zora",
        "ZORA",
        0,
        accounts[0],
        20,
        0
      )

      addressToPrivateKey = network.config.accounts.reduce((obj, acc) => {
        const addr = toChecksumAddress(bufferToHex(privateToAddress(acc.privateKey)))
        obj[addr] = Buffer.from(acc.privateKey.slice(2), 'hex')
        return obj
      }, {})
    })

    function generatePermitSignature(owner, spender, value, nonce, deadline) {
      const privateKey = addressToPrivateKey[owner]

      const sig = sigUtil.signTypedData(privateKey, {
        data: {
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' },
            ],
            Permit: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' },
              { name: 'value', type: 'uint256' },
              { name: 'nonce', type: 'uint256' },
              { name: 'deadline', type: 'uint256' },
            ],
          },
          primaryType: 'Permit',
          domain: {
            name: 'Zora',
            version: '1',
            chainId: network.config.chainId,
            verifyingContract: token.address,
          },
          message: {
            owner,
            spender,
            value,
            nonce,
            deadline,
          },
        }
      })

      const res = fromRpcSig(sig)

      return [res.v, res.r, res.s]
    }

    it("initializes the EIP712 domain separator", async function() {
      const val = await token.DOMAIN_SEPARATOR()
      assert.equal('0x7bcbc69f252066abef2415638baf6bac19f68bbc6c05970cf84571b776c456bd', val)
    })

    it("initializes the EIP712 type hash", async function() {
      const val = await token.PERMIT_TYPEHASH()
      assert.equal('0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9', val)
    })

    it("allows permit calls with valid signatures", async function() {
      const [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        0,
      )

      await token.permit(accounts[1], accounts[2], 2**10 - 1, 0, v, r, s);

      const allowance = await token.allowance(accounts[1], accounts[2])
      assert.equal(2**10 - 1, allowance)
    })

    it("allows permit calls with valid signature and expiration", async function() {
      const expiration = Math.floor(new Date().getTime() / 1000) + (60 * 60) // now + 1 hr
      const [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        expiration,
      )

      await token.permit(accounts[1], accounts[2], 2**10 - 1, expiration, v, r, s);

      const allowance = await token.allowance(accounts[1], accounts[2])
      assert.equal(2**10 - 1, allowance)
    })

    it("allows permit calls with valid signature to override the allowance", async function() {
      let [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        0,
      );
      await token.permit(accounts[1], accounts[2], 2**10 - 1, 0, v, r, s);

      [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        0,
        1,
        0,
      );
      await token.permit(accounts[1], accounts[2], 0, 0, v, r, s);

      const allowance = await token.allowance(accounts[1], accounts[2])
      assert.equal(0, allowance)
    })

    it("reverts permit for 0 address", async function() {
      const [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        0,
      )

      try {
        await token.permit(0, accounts[2], 2**10 - 1, 0, v, r, s);
        assert(false, "Cannot permit 0 address")
      } catch (err) {
        if (err.name === 'AssertionError') {
          throw err;
        }
      }
    })

    it("reverts permit for expired signatures", async function() {
      const [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        5,
      )

      try {
        await token.permit(accounts[1], accounts[2], 2**10 - 1, 5, v, r, s);
        assert(false, "Cannot permit expired signature")
      } catch (err) {
        if (err.name === 'AssertionError') {
          throw err;
        }
      }
    })

    it("reverts permit for replayed nonces", async function() {
      const [v, r, s] = generatePermitSignature(
        accounts[1],
        accounts[2],
        2**10 - 1,
        0,
        0,
      )

      await token.permit(accounts[1], accounts[2], 2**10 - 1, 0, v, r, s);

      try {
        await token.permit(accounts[1], accounts[2], 2**10 - 1, 0, v, r, s);
        assert(false, "Cannot replay permit call")
      } catch (err) {
        if (err.name === 'AssertionError') {
          throw err;
        }
      }
    })
  })
});
