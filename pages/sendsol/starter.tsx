import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const Starter = () => {
    const [bal, setBal] = useState(0);
    const [acc, setAcc] = useState("");
    const [amount, setAmount] = useState(0);
    const [txSig, setTxSig] = useState("");

    const { connection } = useConnection();
    const { publicKey , sendTransaction } = useWallet();

    const handleTxn = async () => {
        if (!connection || !publicKey) {
            toast.error("Please connect your wallet");
            return
        }

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        const txn_info = {
            fee_from : publicKey,
            blockhash : blockhash,
            lastValidBlockHeight : lastValidBlockHeight
        }
        const txn = new Transaction(txn_info);
        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            lamports: amount * LAMPORTS_PER_SOL,
            toPubkey: new PublicKey(acc)
        })
        txn.add(instruction)

        try {
            const sig = await sendTransaction(txn, connection)
            setTxSig(sig)

            const newBal = bal - amount
            setBal(newBal)
        } catch (err) {
            console.log("Error: ", err)
            toast.error("Transaction Failed!")
        }
    }

    useEffect(()=>{
        const getUserInfo = async () => {
            if (connection && publicKey) {
                const info = await connection.getAccountInfo(publicKey);
                setBal(info!.lamports / LAMPORTS_PER_SOL)
            }
        }
        getUserInfo();
    },[connection, publicKey])

    const txn_output = [
        {
          title: "Account Balance",
          dependency: bal,
        },
        {
          title: "Transaction Signature",
          dependency: txSig,
          href: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
        },
      ];

    return(
        <div className="text-white w-full grid justify-center">
           <form className="w-[25rem] grid gap-4">
                <div className="flex justify-between">
                    <h2>Send Sol 💸</h2>
                    <button 
                        className="py-2 px-4 bg-pink-300 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={(e)=>{
                            e.preventDefault();
                            handleTxn();
                        }}
                        disabled={!amount || !acc}
                    >Submit</button>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="account">Address for reciever</label>
                    <input 
                        type="text" 
                        name="account"
                        placeholder="Public key of reciever"
                        className="border-b-2 border-white outline-0 bg-transparent px-2"
                        onChange={(e)=>setAcc(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="amount">Amount in Sol</label>
                    <input 
                        type="number" 
                        placeholder="Amount to send"
                        className="border-b-2 border-white outline-0 bg-transparent px-2"
                        onChange={(e)=>setAmount(Number(e.target.value))}
                    />
                </div>
                <ul>
                {txn_output.map(({ title, dependency, href }) => (
                    <li
                    key={title}
                    className="flex justify-between"
                    >
                    <p>{title}</p>
                    {dependency && (
                        <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        {dependency.toString().slice(0, 25)}
                        {href}
                        </a>
                    )}
                    </li>
                ))}
                </ul>
           </form>
        </div>
    )
}
export default Starter;