import Deso from "deso-protocol";

const deso = new Deso();

export default function Post({showPostPanel, loginResponse, sampleResponse, postContent, handlePostInput, postResponse, setPostResponse}) {
    return (
        <>
            <div>
                <p>What would you like to post?</p>
                <div className="post-group">
                <textarea className="post-textarea" value={postContent} onChange={handlePostInput}></textarea>
                <button className="submit-btn" 
                        onClick={async () => {
                            const postResponse = await deso.posts.submitPost({
                                UpdaterPublicKeyBase58Check: deso.identity.getUserKey(),
                                    BodyObj: {
                                    Body: postContent,
                                    VideoURLs: [],
                                    ImageURLs: []
                                    }
                                });
                            setPostResponse(JSON.stringify(postResponse, null, 2));
                            console.log("Posting: ", postContent);
                            console.log(postResponse);
                        }}>
                            Submit
                        </button>
                    </div>
            </div>
            {
                postResponse && showPostPanel &&
                <div className="post-status">
                    <a href={`https://diamondapp.com/u/${sampleResponse.Profile.Username}`} style={{ color: "white" }}>
                        Posted Successfully
                    </a>
                </div>
            }
    </>
);
}