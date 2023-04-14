import { contractAddress, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
// import { ConnectButton } from "web3uikit"
import { ethers } from "ethers"

export default function RaffleStatus() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [contestants, setContestants] = useState("0")
    const [swapRaffleTokensAt, setSwapRaffleAt] = useState("0")
    const [minEligibility, setMinEligibility] = useState("0")
    const [trustTokensTreasury, setTokensTreasury] = useState("0")
    const [raffleTokens, setRaffleTokens] = useState("0")
    const [currentRaffleCount, setCurrentRaffleCount] = useState("0")
    const [balanceOfDead, setBalanceOfDead] = useState("0")
    const [balanceOfAccount, setBalanceOfAccount] = useState("0")
    const [isInRaffleText, setIsInRaffle] = useState("Loading Data...")

    const { runContractFunction: getRaffleInfo } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getRaffleInfo",
        params: { _address: account },
    })

    const { runContractFunction: getUintVars } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getUintVars",
        params: {},
    })
    const { runContractFunction: getRaffleEntrantsCounts } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getRaffleEntrantsCounts",
        params: {},
    })
    const { runContractFunction: getBalanceOfDead } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "balanceOf",
        params: { account: "0x000000000000000000000000000000000000dEaD" },
    })
    const { runContractFunction: getBalanceOfAccount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "balanceOf",
        params: { account: account },
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    async function updateUI() {
        // const tokenContract = new ethers.Contract(contractAddress, abi, account)

        const { 0: contestantsFromCall, 1: hodlersFromCall } = await getRaffleEntrantsCounts()
        const { 0: currentRaffleCountFromCall, 1: isInRaffleFromCall } = await getRaffleInfo()
        let isInRaffleTextFromCall = ""
        if (isInRaffleFromCall) {
            isInRaffleTextFromCall = "You are a contestant for the current raffle"
        } else {
            isInRaffleTextFromCall = "You are NOT a contestant for the current raffle"
        }

        const {
            0: swapTrustTokensAtFromCall,
            1: swapRaffleTokensAtFromCall,
            2: minEligibilityFromCall,
            3: raffleTokensFromCall,
            4: trustTokensFromCall,
            5: trustTokensTreasuryFromCall,
        } = await getUintVars()

        const balanceOfDeadFromCall = await getBalanceOfDead()
        const balanceOfAccountFromCall = await getBalanceOfAccount()

        setContestants(contestantsFromCall.toString())
        setSwapRaffleAt(swapRaffleTokensAtFromCall.toString())
        setMinEligibility(minEligibilityFromCall.toString())
        setRaffleTokens(raffleTokensFromCall.toString())
        setTokensTreasury(trustTokensTreasuryFromCall.toString())
        setIsInRaffle(isInRaffleTextFromCall)
        setCurrentRaffleCount(currentRaffleCountFromCall.toString())
        setBalanceOfDead(balanceOfDeadFromCall.toString())
        setBalanceOfAccount(balanceOfAccountFromCall.toString())
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return (
        <div className="p-5">
            {chainIdHex ? (
                <>
                    <ul class="list-group">
                        <li class="list-group-item list-group-item-success">
                            <h1 className="py-4 px-4 font-bold text-3xl">
                                Raffle # {currentRaffleCount}
                            </h1>{" "}
                            (token amounts rounded to the nearest whole number)
                        </li>
                        <li class="list-group-item">
                            <b>{isInRaffleText}</b>
                        </li>
                        <li class="list-group-item">
                            <b>
                                {numberWithCommas(
                                    Math.round(ethers.utils.formatUnits(minEligibility, "ether"))
                                )}{" "}
                            </b>
                            tokens is minimun buy required to enter this raffle
                        </li>
                        <li class="list-group-item">
                            {" "}
                            <b>{contestants}</b> contestants in current raffle
                        </li>
                        <li class="list-group-item ">
                            {" "}
                            <b>
                                {numberWithCommas(
                                    Math.round(
                                        ethers.utils.formatUnits(swapRaffleTokensAt, "ether")
                                    )
                                )}{" "}
                            </b>{" "}
                            tokens to be rewarded for current raffle
                        </li>
                        <li class="list-group-item">
                            <b>
                                {numberWithCommas(
                                    Math.round(ethers.utils.formatUnits(raffleTokens, "ether"))
                                )}{" "}
                            </b>{" "}
                            tokens collected for current raffle. Once this amount exceeds{" "}
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(swapRaffleTokensAt, "ether"))
                            )}{" "}
                            tokens, the first sell/transfer tx will trigger the raffle. The winner
                            (if any) will get the reward and all surplus tokens will be sent to
                            dead address
                        </li>
                    </ul>

                    <ul class="list-group">
                        <li class="list-group-item list-group-item-success">
                            <h1 className="py-4 px-4 font-bold text-3xl">Other Data</h1>
                        </li>
                        {/* <li class="list-group-item"> */}
                        {/* <b>{ethers.utils.formatUnits(contractEthBalance, "ether")} ETH</b>{" "} */}
                        {/* Currently Collected In Contract's ETH Treasury */}
                        {/* </li> */}
                        <li class="list-group-item">
                            <b>
                                {numberWithCommas(
                                    Math.round(
                                        ethers.utils.formatUnits(trustTokensTreasury, "ether")
                                    )
                                )}{" "}
                            </b>{" "}
                            tokens collected in contract's token treasury
                        </li>
                        <li class="list-group-item">
                            <b>
                                {numberWithCommas(
                                    Math.round(ethers.utils.formatUnits(balanceOfDead, "ether"))
                                )}{" "}
                            </b>{" "}
                            tokens sent to dead address so far{" "}
                        </li>
                        <li class="list-group-item">
                            <b>
                                {numberWithCommas(
                                    Math.round(ethers.utils.formatUnits(balanceOfAccount, "ether"))
                                )}{" "}
                            </b>{" "}
                            tokens held in your account{" "}
                        </li>
                    </ul>
                </>
            ) : (
                <div className="text-amber-700">Please connect your wallet (MetaMask only)</div>
            )}
        </div>
    )
}
