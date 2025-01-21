import { ConnectionProvider, useConnection, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";


const Starter = () => {
    // using my own variables and import methods to better 
    // understand why everything is working the way it is
    const [bal, setBal] = useState(0);
    const endpoint = clusterApiUrl('devnet')
    const wallets = [new PhantomWalletAdapter()]

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    useEffect(()=>{
        const getUserInfo = async () => {
            if (connection && publicKey) {
                const info = await connection.getAccountInfo(publicKey);
                // this line is calculating the balance in SOL and updating the state with this value.
                setBal(info!.lamports / LAMPORTS_PER_SOL)
            }
        }
        getUserInfo();
    },[connection, publicKey])

    return(
        <div className="h-screen w-full grid justify-center text-white">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <div className="bg-purple-800 h-[10rem] w-[30rem] p-8 rounded-md">
                            <div>
                                <h2>User Account</h2>
                            </div>
                            <div className="border-2 border-green-200 p-4 rounded-md w-full">
                                <div className="flex items-center justify-between w-full">
                                    <p>User Wallet Connected -&gt;</p>
                                    <p className="text-green-500">{ publicKey? "Yes": "No" }</p>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <p>Balance -&gt;</p>
                                    <p className="text-green-500">{bal}</p>
                                </div>
                            </div>  
                        </div>    
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    )
}

export default Starter;