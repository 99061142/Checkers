import { Component } from "react";

class LoadingFallback extends Component {
    render() {
        return (
            <div
                className="position-absolute m-auto top-0 bottom-0 start-0 end-0 spinner-border"
                role="status"
                style={{
                    width: "10rem",
                    height: "10rem"
                }}
            />
        )
    }
}

export default LoadingFallback;