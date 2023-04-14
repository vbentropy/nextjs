// This file is to show what making a connect button looks like behind the scenes!

import { useEffect } from "react"
import { useMoralis } from "react-moralis"

// Top navbar
export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } =
        useMoralis()

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== "undefined" &&
            window.localStorage.getItem("connected")
        ) {
            enableWeb3()
            // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
        }
    }, [isWeb3Enabled])
    // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changesan

    useEffect(() => {
        Moralis.onAccountChanged((newAccount) => {
            console.log(`Account changed to ${newAccount}`)
            if (newAccount == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <ul className="ml-0 py-2 px-4">
                <li className="flex flex-row">
                    <a className="mt-0" href="https://vitablock.ai">
                        <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>{" "}
                        Back To Main
                    </a>
                </li>
            </ul>

            <ul className="ml-auto py-2 px-4">
                <li className="flex flex-row">
                    {account ? (
                        <div className="ml-auto py-2 px-4">
                            Connected to {account.slice(0, 6)}...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                try {
                                    if (typeof web3 !== "undefined") {
                                        const user = await Moralis.authenticate()
                                        web3 = await Moralis.enable()
                                    } else {
                                        const user = await Moralis.authenticate({
                                            provider: "walletconnect",
                                        })
                                        web3 = await Moralis.enable({ provider: "walletconnect" })
                                    }
                                    walletAddress = user.get("ethAddress")
                                } catch (error) {
                                    console.log("authenticate failed", error)
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect To MetaMask
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}
