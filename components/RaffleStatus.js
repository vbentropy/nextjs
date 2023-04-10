import { contractAddress, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
// import { useNotification } from "web3uikit"
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
            isInRaffleTextFromCall = "Your account is in this raffle"
        } else {
            isInRaffleTextFromCall = "Your account is not in this raffle"
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
                    <nav className="p-5 border-b-2 flex flex-row">
                        <h1 className="py-4 px-4 font-bold text-3xl">
                            Raffle # {currentRaffleCount} (token amounts rounded to the nearest
                            whole number)
                        </h1>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>{isInRaffleText}</b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(minEligibility, "ether"))
                            )}{" "}
                            tokens is minimun buy required to enter this raffle{" "}
                        </b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>{contestants} contestants in current raffle </b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(swapRaffleTokensAt, "ether"))
                            )}{" "}
                            tokens to be rewarded for current raffle{" "}
                        </b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(raffleTokens, "ether"))
                            )}{" "}
                            tokens collected for current raffle (if this amount exceeds Reward
                            Amount, raffle will execute with the next sell/transfer tx and surplus
                            tokens will be sent to dead address){" "}
                        </b>
                    </nav>

                    <nav className="p-5 border-b-2 flex flex-row">
                        <h1 className="py-4 px-4 font-bold text-3xl">Other Data:</h1>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(trustTokensTreasury, "ether"))
                            )}{" "}
                            tokens collected in contract's token treasury{" "}
                        </b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(balanceOfDead, "ether"))
                            )}{" "}
                            tokens sent to dead address so far{" "}
                        </b>
                    </nav>
                    <nav className="p-5 border-b-2 flex flex-row">
                        {" "}
                        <b>
                            {numberWithCommas(
                                Math.round(ethers.utils.formatUnits(balanceOfAccount, "ether"))
                            )}{" "}
                            tokens held in your account{" "}
                        </b>
                    </nav>
                </>
            ) : (
                <nav className="p-5 border-b-2 flex flex-row">
                    <h1 className="py-4 px-4 font-bold text-3xl">
                        Please connect to Ethereum Mainnet.
                    </h1>
                </nav>
            )}
        </div>
    )
}
