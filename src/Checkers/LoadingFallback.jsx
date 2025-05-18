import { Component } from 'react';

class LoadingFallback extends Component {
    render() {
        return (
            <div
                className="spinner-border"
                role="status"
                style={{
                    width: "10rem",
                    height: "10rem"
                }}
            />
        );
    }
}

export default LoadingFallback;