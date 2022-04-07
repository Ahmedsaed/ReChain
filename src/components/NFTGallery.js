import { useEffect, useState } from "react";
import Deso from "deso-protocol";
const deso = new Deso();

export default function NFTGallery() {
    const [NFTResponse, setNFTResponse] = useState();

    useEffect(() => {
        let mounted = true;
        async function getNFTs() {
            const request = {
                "ReaderPublicKeyBase58Check": "BC1YLheA3NepQ8Zohcf5ApY6sYQee9aPJCPY6m3u6XxCL57Asix5peY"
            };
            const response = await deso.nft.getNftShowcase(request);
            setNFTResponse(response);
        };

        if (mounted) getNFTs();

        return () => mounted = false;
    }, [NFTResponse])

    return (
        <div className="nft-gallery">
            {
                NFTResponse && NFTResponse.data.NFTCollections.slice(10, 20).map((element, index) => {
                    return (<img key={index} src={element.PostEntryResponse.ImageURLs[0]} alt="NFT" className="NFTimage"></img>);
                })
            }
        </div>
    );
}