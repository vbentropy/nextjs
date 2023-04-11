import Head from "next/head"
import styles from "../styles/Home.module.css"
import RaffleStatus from "../components/RaffleStatus"
import Header from "../components/Header"
import Title from "../components/Title"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>VBlock Raffle Status</title>
                <meta name="description" content="Raffle Status" />
                <link rel="icon" href="/logo-16x16.png" />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css"
                    integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
                    crossorigin="anonymous"
                ></link>
            </Head>
            <Header />
            <Title />
            <RaffleStatus />
        </div>
    )
}
