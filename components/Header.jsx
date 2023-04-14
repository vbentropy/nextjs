import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <a href="https://vitablock.ai">
                <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> Back To
                Main
            </a>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
