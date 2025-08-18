import { FC } from 'react';

const LoadingFallback: FC = () => {
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

export default LoadingFallback;