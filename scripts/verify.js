const hre = require("hardhat");

const verifyContract = async (dataObj) => {
	console.log('verification started')
	console.log(dataObj)

	try {
		// Need to wait for 5 blocks confirmation to verify contract
		// await deployTransaction.wait(5)
		// cannot get function here as JSON.stringify doesn't support functions
		await hre.run("verify:verify", {
			address: dataObj.contractAddr,
			// constructorArguments: dataObj.constructorArgs,
		})
		console.log('Verification Completed')
	} catch (verifyContractErr) {
		console.log('Already Verified')
		console.log({ verifyContractErr })
	}
}

module.exports = {
	verifyContract
}