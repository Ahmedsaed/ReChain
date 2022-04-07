export default function NFTGallery({NFTResponse}) {
    console.log("Response: ", NFTResponse);

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