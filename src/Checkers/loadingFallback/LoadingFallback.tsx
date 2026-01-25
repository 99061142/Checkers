import { FC } from 'react';
import styles from './LoadingFallback.module.css';

const LoadingFallback: FC = () => {
    return (
        <div
            className={`spinner-border ${styles.loadingSpinner}`}
            role="status"
        />
    );
}

export default LoadingFallback;