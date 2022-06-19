import Head from 'next/head'
import { useState } from 'react'
import { ethers } from 'ethers'
import {
  Center, Button, Text, Spinner, Flex, Spacer, Switch,
  useColorMode, Stack, Checkbox, Box
} from '@chakra-ui/react'
import Input1 from '../components/Input1'
import { connectToWeb3 } from '../api/web3Provider'
import { getAbiAndBytecode, getNetworkName, getTokenAddressPrefix } from '../api/utils'


function Home() {
  const { toggleColorMode } = useColorMode()

  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState('')
  const [isMintable, setIsMintable] = useState(false)
  const [isBurnable, setIsBurnable] = useState(false)
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const [currChainId, setCurrChainId] = useState('')
  const [buttonText1, setButtonText1] = useState('Mint')
  const [showBtnSpinner, setShowBtnSpinner] = useState(false)
  const [message1, setMessage1] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')


  const addTokenToMetamsk = async () => {

    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        }
      }
    })
  }


  const handleCreateToken = async () => {

    setMessage1('')
    if (tokenName === '') return setMessage1('Provide Token Name')
    if (tokenSymbol === '') return setMessage1('Provide Token Symbol')
    if (totalSupply < 0) return setMessage1('Total Supply could not be negative')
    if (tokenDecimals < 0) return setMessage1('Token Decimals could not be negative')

    const chainId = await connectToWeb3()
    if (chainId === null) {
      setMessage1('Could not able to connect with Web3')
      return
    } else {
      setCurrChainId(chainId)
    }

    try {
      setButtonText1('Creating...')
      setShowBtnSpinner(true)
      setIsFormDisabled(true)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const currentERC20 = getAbiAndBytecode(isMintable, isBurnable)
      const Token0 = new ethers.ContractFactory(currentERC20.abi, currentERC20.bytecode, signer)
      const amount1 = ethers.utils.parseUnits(totalSupply, tokenDecimals).toString()
      const token0 = await Token0.deploy(tokenName, tokenSymbol, tokenDecimals, amount1)
      const { address, deployTransaction } = token0
      await deployTransaction.wait()

      setButtonText1('Add Token To Wallet')
      setTokenAddress(address)
      setShowBtnSpinner(false)

      // Contract Verification (need not to execute, as etherscan 
      // automatically verifies contract if it has same code 
      // and same or different constructor arguments)
      // const dataObj = {
      //   contractAddr: address,
      //   constructorArgs: [tokenName, tokenSymbol, tokenDecimals, amount1]
      // }
      // console.log(dataObj)
      // await fetch(`/api/verify`, {
      //   method: "POST",
      //   body: JSON.stringify(dataObj)
      // })
    } catch (error) {
      console.log(error)
      setMessage1('Error Occured while Creating Token')
    }
    setButtonText1('Create')
    setShowBtnSpinner(false)
    setIsFormDisabled(false)
  }

  return (
    <Box minHeight='100vh' position='relative'>
      <Head>
        <title>Generate ERC20</title>
        <meta name="description" content="Create, Generate, Mint ERC20" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex padding='15px'>
        <Text fontSize='xl' fontWeight='bold'>ERC20 Token Generator</Text>
        <Spacer />
        <Switch size='lg'
          onChange={toggleColorMode}
        />
      </Flex>

      <Center marginTop='50px'>
        <Flex maxWidth='350px' flexDir='column'>

          <Input1
            placeholder='Token Name'
            value={tokenName}
            onChange={e => setTokenName(e.target.value)}
            isDisabled={isFormDisabled}
          />
          <Input1
            placeholder='Token Symbol'
            value={tokenSymbol}
            onChange={e => setTokenSymbol(e.target.value)}
            isDisabled={isFormDisabled}
          />
          <Input1
            placeholder='Token Decimals'
            value={tokenDecimals}
            onChange={e => setTokenDecimals(e.target.value)}
            isDisabled={isFormDisabled}
          />
          <Text opacity='0.5'>Not sure about decimals?, then use 18</Text>

          <Input1
            placeholder='Initial Supply'
            value={totalSupply}
            onChange={e => setTotalSupply(e.target.value)}
            isDisabled={isFormDisabled}
          />

          <Stack spacing={10} direction="row" margin='10px 0'>
            <Checkbox
              isChecked={isMintable}
              onChange={e => setIsMintable(e.target.checked)}
              isDisabled={isFormDisabled}
            >
              Mintable
            </Checkbox>
            <Checkbox
              isChecked={isBurnable}
              onChange={e => setIsBurnable(e.target.checked)}
              isDisabled={isFormDisabled}
            >
              Burnable
            </Checkbox>
          </Stack>

          <Text>{message1}</Text>

          <Button
            onClick={() => {
              if (tokenAddress.length > 0) addTokenToMetamsk()
              else handleCreateToken()
            }}
            isDisabled={isFormDisabled && tokenAddress.length === 0}
          >
            {buttonText1} {'  '} {showBtnSpinner && <Spinner marginLeft='10px' />}
          </Button>

          {tokenAddress.length > 0 &&

            <Text fontWeight='bold' textAlign='center' marginTop='20px'>
              <a href={`${getTokenAddressPrefix(currChainId)}${tokenAddress}`} target='_blank'>
                Check on {getNetworkName(currChainId)}
              </a>
            </Text>
          }

        </Flex>
      </Center>

    </Box>
  )
}

export default Home
