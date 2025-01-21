import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";


const Starter = () => {
    const [bal, setBal] = useState(0);
    const [acc, setAcc] = useState("");
    const [amount, setAmount] = useState(0);
    const [txSig, setTxSig] = useState("");

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    useEffect(()=>{
        const getUserInfo = async () => {
            if (connection && publicKey) {
                const info = await connection.getAccountInfo(publicKey);
                setBal(info!.lamports / LAMPORTS_PER_SOL)
            }
        }
        getUserInfo();
    },[connection, publicKey])


    return(
        <div className="text-white">
            <h1>Hello World</h1>
        </div>
    )
}

export default Starter;