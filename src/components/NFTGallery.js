import { useEffect, useState } from "react";
import Placeholder from "./Placeholder";
import Deso from "deso-protocol";
import "./NFTGallery.css";

const deso = new Deso();

export default function NFTGallery() {
    const [NFTResponse, setNFTResponse] = useState();
    const [batch, setBatch] = useState(0);

    useEffect(() => {
        let mounted = true;
        async function getNFTs() {
            const request = {
                "ReaderPublicKeyBase58Check": "BC1YLgKwWCzT35Y6LW3sxDLVddnrGSx8NkU1DNgdrp3Sgem11UEBHH8"
            };
            const response = await deso.nft.getNftShowcase(request);
            setNFTResponse(response);
        };

        if (mounted) getNFTs();

        return () => mounted = false;
    }, [])

    return (
        <div className="nft-gallery">
            <div className="NFT-btn-group">
                <button className="NFT-btn NFT-left-btn" disabled={!(batch >= 10)} onClick={() => setBatch(batch - 10)}>Previous</button>
                <p className="NFT-batch-view">{batch + "-" + (batch+10)}</p>
                <button className="NFT-btn NFT-right-btn" disabled={NFTResponse && NFTResponse.data.NFTCollections.length < batch + 10} onClick={() => setBatch(batch + 10)}>Next</button>
            </div>
            {
                (
                    NFTResponse && NFTResponse.data.NFTCollections.slice(batch, batch + 10).map((element, index) => {
                        return (<img key={index} src={element.PostEntryResponse.ImageURLs[0]} alt="NFT" className="NFTimage"></img>);
                    })
                ) ||
                <Placeholder type="loading" text="Loading" />
            }
        </div>
    );
}