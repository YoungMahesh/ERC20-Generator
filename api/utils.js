import ERC20_Simple from '../artifacts/contracts/ERC20_Simple.sol/ERC20_Simple.json'
import ERC20_Burn from '../artifacts/contracts/ERC20_Burn.sol/ERC20_Burn.json'
import ERC20_Mint from '../artifacts/contracts/ERC20_Mint.sol/ERC20_Mint.json'
import ERC20_Burn_Mint from '../artifacts/contracts/ERC20_Burn_Mint.sol/ERC20_Burn_Mint.json'


export const getTokenAddressPrefix = (chainId) => {
	if (chainId === '0x3') return 'https://ropsten.etherscan.io/token/'
	if (chainId === '0x4') return 'https://rinkeby.etherscan.io/token/'
	if (chainId === '0x89') return 'https://polygonscan.com/address/'
	if (chainId === '0x38') return 'https://bscscan.com/address/'
	if(parseInt(chainId) === 1666700000) return 'https://explorer.testnet.harmony.one/address/'
	return 'https://etherscan.io/token/'
}

export const getNetworkName = (chainId) => {
	if (chainId === '0x89') return 'PolygonScan'
	if (chainId === '0x38') return 'BscScan'
	if(parseInt(chainId) === 1666700000) return 'Harmony Explorer'
	return 'Etherscan'
}

export const getAbiAndBytecode = (isMintable, isBurnable) => {
	if (isMintable && isBurnable) {
		return ERC20_Burn_Mint
	}
	else if (isMintable) {
		return ERC20_Mint
	}
	else if (isBurnable) {
		return ERC20_Burn
	}
	else return ERC20_Simple
}