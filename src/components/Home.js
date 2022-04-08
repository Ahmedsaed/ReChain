import "./Home.css";
import Deso from 'deso-protocol';

const deso = new Deso();

export default function Home() {
    async function getHotFeed() {
        const request = {
            "ResponseLimit": 10
        };
        const response = await deso.posts.getHotFeed(request);
        console.log(response)
    }

    getHotFeed();

    return (
        <>
        </>
    )
}